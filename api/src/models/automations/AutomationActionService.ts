import { AutomationAction, AutomationActionChannel, AutomationActionChannelType, AutomationActionType, PrismaClient, UserOfCustomer } from 'prisma/prisma-client';
import { groupBy, uniqBy } from 'lodash';

import UserService from '../users/UserService';
import config from '../../config/config';
import { ReportLambdaInput, ReportService } from './ReportService';
import { GenerateReportPayload, UserWithAssignedDialogues } from '../../models/users/UserServiceTypes';
import makeDialogueLinkReminderTemplate from '../../services/mailings/templates/makeDialogueLinkReminderTemplate';
import makeReportMailTemplate from '../../services/mailings/templates/makeReportTemplate';
import makeStaleRequestReminderTemplate from '../../services/mailings/templates/makeStaleRequestReminderTemplate';
import { mailService } from '../../services/mailings/MailService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import { CustomerPrismaAdapter } from '../../models/customer/CustomerPrismaAdapter';
import UserPrismaAdapter from '../../models/users/UserPrismaAdapter';
import { ScheduledAutomationPrismaAdapter } from './ScheduledAutomationPrismaAdapter';
import { GraphQLYogaError } from '@graphql-yoga/node';
import ActionRequestService from '../ActionRequest/ActionRequestService';

export class AutomationActionService {
  private prisma: PrismaClient;
  private userService: UserService;
  private reportService: ReportService;
  automationPrismaAdapter: AutomationPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;
  userPrismaAdapter: UserPrismaAdapter;
  scheduledAutomationPrismaAdapter: ScheduledAutomationPrismaAdapter;
  actionRequestService: ActionRequestService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.userService = new UserService(prisma);
    this.reportService = new ReportService();
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
    this.userPrismaAdapter = new UserPrismaAdapter(prisma);
    this.scheduledAutomationPrismaAdapter = new ScheduledAutomationPrismaAdapter(prisma);
    this.actionRequestService = new ActionRequestService(prisma);
  }

  /**
   * Sends a reminder to all users in a workspace who have stale action requests 
   */
  public async sendStaleRequestReminder(automationActionId: string, workspaceId: string, daysNoAction: number) {
    console.log('automationActionId: ', automationActionId);
    const automationAction = await this.automationPrismaAdapter.findAutomationActionById(automationActionId);

    if (!automationAction) throw new GraphQLYogaError('No automation action found for ID!');

    try {
      for (const channel of automationAction.channels) {
        await this.handleStaleActionReminderChannel(channel, workspaceId, daysNoAction);
      }
    } catch {
      return false
    }

    return true;
  }

  /**
   * Send a report from an automation.
   * This fetches the relevant action based on the given report automation, and then for each channel, dispatches this
   * report.
   */
  public async sendReport(automationActionId: string, workspaceSlug: string, reportUrl: string) {
    const automationAction = await this.automationPrismaAdapter.findAutomationActionById(automationActionId);

    if (!automationAction) throw new GraphQLYogaError('No automation action found for ID!');

    for (const channel of automationAction.channels) {
      await this.handleReportChannel(channel, workspaceSlug, reportUrl);
    }

    return true;
  };

  /**
   * Finds all AutomationAction Channels by an automation action ID
   * @param automationActionId
   * @returns
   */
  public async findChannelsByActionId(automationActionId: string) {
    return this.scheduledAutomationPrismaAdapter.findChannelsByAutomationActionId(automationActionId);
  }

  /**
   * Sends an email with a url to all users (who have an assigned dialogue) provided in an automation action
   * @returns a boolean indicating whether the call was a succes or not
   */
  public async sendDialogueLink(
    workspaceSlug: string,
    automationActionId: string
  ): Promise<boolean> {
    const channels = await this.findChannelsByActionId(automationActionId);

    for (const channel of channels) {
      await this.handleSendDialogueChannel(channel, workspaceSlug)
    }
    return true;
  }

  private async dispatchStaleRequestReminderJob(workspaceSlug: string, userId: string, totalRequests: number) {
    const user = await this.userService.getUserById(userId);

    if (!user) return;

    mailService.send({
      body: makeStaleRequestReminderTemplate({
        recipientName: user.firstName || 'User',
        totalRequests,
        userId: user.id,
        workspaceSlug,
      }),
      recipient: user.email,
      subject: 'You have people waiting for your assistance!',
    });
  }

  /**
   * Send mails out to each recipient of the actions.
   * @param recipients List of users who receive the mail
   * @param workspaceSlug Workspace slug
   */
  public async dispatchReminderMailJobs(
    recipients: UserOfCustomer[],
    workspaceSlug: string
  ): Promise<void[]> {
    return await Promise.all(recipients.map(async (recipient) => {
      const user = await this.userPrismaAdapter.findPrivateDialogueOfUser(recipient.userId, workspaceSlug);
      if (!user) return;

      // TODO: Add support for multiple client URLs if a user is assinged to multipled dialogues
      const privateDialogues = user?.isAssignedTo;
      if (!privateDialogues?.length) { return };

      mailService.send({
        body: makeDialogueLinkReminderTemplate({
          recipientName: user.firstName || 'User',
          dialogues: privateDialogues,
          workspaceSlug,
        }),
        recipient: user.email,
        subject: 'A new HAAS survey has been released for your team',
      });
    }));
  }

  /**
   * Sends an client dialogue link to all recipients in the channel's payload based on the channel's type (e.g. EMAIL, SLACK etc.)
   * @param channel
   * @param workspaceSlug
   */
  public async handleSendDialogueChannel(
    channel: AutomationActionChannel,
    workspaceSlug: string,
  ) {
    switch (channel.type) {
      case AutomationActionChannelType.EMAIL:
        await this.sendDialogueEmails(workspaceSlug);
        break;
      case AutomationActionChannelType.SMS:
        // TODO: Implement
        break;
      case AutomationActionChannelType.SLACK:
        // TODO: Implement
        break;
      default:
        await this.sendDialogueEmails(workspaceSlug);
        break;
    }
  }

  /**
   * Find recipients of all actions.
   * @param actionIds
   * @param workspaceSlug
   * @returns
   */
  public async findActionsRecipients(actionIds: string[], workspaceSlug: string) {
    const recipients = await Promise.all(actionIds.map(async (actionId) => {
      const actionRecipients = await this.findActionRecipients(actionId, workspaceSlug);
      return actionRecipients;
    }));

    return uniqBy(recipients.flat(), (recipient) => recipient.user.email);
  }

  /**
   * Finds all recipients for an automation action
   * @param automationActionId
   * @param workspaceSlug
   * @returns
   */
  private async findActionRecipients(automationActionId: string, workspaceSlug: string) {
    const automationAction = await this.prisma.automationAction.findUnique({
      where: {
        id: automationActionId,
      },
      include: {
        channels: true,
      },
    });

    if (!automationAction) throw new GraphQLYogaError('No automation action found for ID!');

    // FIXME: Handle all channels!
    const payload = (automationAction.channels[0].payload as unknown) as GenerateReportPayload;
    const users = await this.userService.findTargetUsers(workspaceSlug, payload);

    return users;
  };

  /**
   * Sends an email containing a report to all recipients in the channel's payload
   * @param channel
   * @param workspaceSlug
   * @param reportUrl url to the downloadable report PDF (S3)
   */
  private async handleReportEmailChannel(
    channel: AutomationActionChannel,
    workspaceSlug: string,
    reportUrl: string
  ) {
    const payload = (channel.payload as unknown) as GenerateReportPayload;
    const recipients = await this.userService.findTargetUsers(workspaceSlug, payload);

    recipients.forEach((recipient) => {
      const triggerBody = makeReportMailTemplate(
        {
          recipientMail: recipient.user.firstName || 'User',
          reportUrl,
        }
      );

      mailService.send({
        body: triggerBody,
        recipient: recipient.user.email,
        subject: 'A new HAAS Report Has been released',
      });
    })
  };

  /**
   * Send mails out to each recipient of the actions.
   * @param recipients List of users who receive the mail
   * @param workspaceSlug Workspace slug
   */
  public async dispatchDialogueEmails(
    users: UserWithAssignedDialogues[],
    workspaceSlug: string
  ): Promise<void[]> {
    return await Promise.all(users.map(async (user) => {
      // TODO: Add support for multiple client URLs if a user is assinged to multipled dialogues
      const assignedDialogues = user?.isAssignedTo;
      if (!assignedDialogues?.length) { return };

      mailService.send({
        body: makeDialogueLinkReminderTemplate({
          recipientName: user.firstName || 'User',
          dialogues: assignedDialogues,
          workspaceSlug,
        }),
        recipient: user.email,
        subject: 'A new HAAS survey has been released for your team(s)',
      });
    }));
  }

  /**
   * Sends an email containing a dialogue client link to all recipients in the channel's payload
   * @param workspaceSlug
   */
  private async sendDialogueEmails(
    workspaceSlug: string,
  ) {
    const users = await this.userService.findAssignedUsers(workspaceSlug);
    await this.dispatchDialogueEmails(users, workspaceSlug);
  }

  /**
   * Send a report via a given channel.
   */
  private async handleReportChannel(
    channel: AutomationActionChannel,
    workspaceSlug: string,
    reportUrl: string
  ) {
    switch (channel.type) {
      case AutomationActionChannelType.EMAIL:
        await this.handleReportEmailChannel(channel, workspaceSlug, reportUrl);
        break;
      case AutomationActionChannelType.SMS:
        // TODO: Implement
        break;
      case AutomationActionChannelType.SLACK:
        // TODO: Implement
        break;
      default:
        await this.handleReportEmailChannel(channel, workspaceSlug, reportUrl);
        break;
    }
  }

  /**
   * Send a report by going to the dashboard's report.
   *
   * This dispatches a lambda job to go to the dashboard and take a "screenshot" of a certain page.
   */
  public async dispatchGenerateReportJob(
    automationActionId: string,
    workspaceSlug: string,
    dialogueSlug?: string
  ) {
    // Get bot user to create report with
    const botUser = await this.userService.findBotByWorkspaceName(workspaceSlug);

    // Construct input parameters for the job service
    const dashboardUrl = config.dashboardUrl;
    const reportUrl = `${dashboardUrl}/dashboard/b/${workspaceSlug}/d/${dialogueSlug}/_reports/weekly`;
    const apiUrl = `${config.baseUrl}/graphql`;

    const authenticateEmail = 'automations@haas.live' // TODO: I think this one is not needed anymore

    const reportInput: ReportLambdaInput = {
      API_URL: apiUrl,
      AUTHENTICATE_EMAIL: authenticateEmail,
      DASHBOARD_URL: dashboardUrl,
      REPORT_URL: reportUrl,
      WORKSPACE_EMAIL: botUser?.email || '',
      WORKSPACE_SLUG: workspaceSlug,
      USER_ID: botUser?.id as string,
      AUTOMATION_ACTION_ID: automationActionId,
    }

    return this.reportService.dispatchJob(reportInput);
  }

  private async handleStaleActionReminderEmailChannel(
    workspaceId: string,
    daysNoAction: number
  ) {
    const workspace = await this.customerPrismaAdapter.findWorkspaceById(workspaceId);
    const actionRequests = await this.actionRequestService.findStaleWorkspaceActionRequests(
      workspaceId,
      daysNoAction
    );

    console.log('actionRequests: ', actionRequests);

    if (!workspace || !actionRequests.length) return;

    const requestsGroupedUserId = groupBy(actionRequests, (request) => request.assigneeId);

    for (const [userId, requests] of Object.entries(requestsGroupedUserId)) {
      const totalRequests = requests.length;
      await this.dispatchStaleRequestReminderJob(workspace.slug, userId, totalRequests);
    }

    // Update lastReminded for all stale requests
    const actionRequestIds = actionRequests.map((request) => request.id)
    await this.actionRequestService.updateLastRemindedStaleRequests(actionRequestIds, workspace);
  }

  private async handleStaleActionReminderChannel(
    channel: AutomationActionChannel,
    workspaceId: string,
    daysNoAction: number
  ) {
    switch (channel.type) {
      case AutomationActionChannelType.EMAIL:
        await this.handleStaleActionReminderEmailChannel(workspaceId, daysNoAction);
        break;
      case AutomationActionChannelType.SMS:
        // TODO: Implement
        break;
      case AutomationActionChannelType.SLACK:
        // TODO: Implement
        break;
      default:
        await this.handleStaleActionReminderEmailChannel(workspaceId, daysNoAction);
        break;
    }
  }
}
