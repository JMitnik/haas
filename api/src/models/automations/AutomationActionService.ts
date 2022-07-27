import { AutomationAction, AutomationActionChannel, AutomationActionChannelType, AutomationActionType, PrismaClient, UserOfCustomer } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { uniqBy } from 'lodash';

import UserService from '../users/UserService';
import config from '../../config/config';
import { ReportLambdaInput, ReportService } from '../../services/report/ReportService';
import { GenerateReportPayload } from '../../models/users/UserServiceTypes';
import makeDialogueLinkReminderTemplate from '../../services/mailings/templates/makeDialogueLinkReminderTemplate';
import makeReportMailTemplate from '../../services/mailings/templates/makeReportTemplate';
import { mailService } from '../../services/mailings/MailService';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';
import { CustomerPrismaAdapter } from '../../models/customer/CustomerPrismaAdapter';
import UserPrismaAdapter from '../../models/users/UserPrismaAdapter';

export class AutomationActionService {
  private prisma: PrismaClient;
  private userService: UserService;
  private reportService: ReportService;
  automationPrismaAdapter: AutomationPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;
  userPrismaAdapter: UserPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.userService = new UserService(prisma);
    this.reportService = new ReportService();
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
    this.userPrismaAdapter = new UserPrismaAdapter(prisma);
  }

  /**
   * Runs an action lambda based on the specified AutomationActionType
   * @param automationAction an Prisma AutomationAction object
   * @param workspaceSlug the slug of the workspace the automation belongs to
   * @param dialogueSlug the slug of the pertaining dialogue (OPTIONAL)
   * @returns the succesfull running of a SNS related to the action
   */
  public handleAutomationAction = async (
    automationAction: AutomationAction & { channels: AutomationActionChannel[] },
    workspaceSlug: string,
    dialogueSlug?: string
  ) => {
    switch (automationAction.type) {
      case AutomationActionType.SEND_DIALOGUE_LINK:
        return this.sendDialogueLink(
          automationAction.automationScheduledId as string, workspaceSlug
        );
      case AutomationActionType.WEEK_REPORT:
        return this.generateReport(
          automationAction.id,
          workspaceSlug,
          dialogueSlug,
        );
      case AutomationActionType.MONTH_REPORT:
        return this.generateReport(
          automationAction.id,
          workspaceSlug,
          dialogueSlug,
        );
      case AutomationActionType.YEAR_REPORT:
        return this.generateReport(
          automationAction.id,
          workspaceSlug,
          dialogueSlug,
        );

      default: {
        return new Promise((resolve) => resolve(''));
      }
    };
  }

  /**
   * Finds all AutomationAction Channels by an automation action ID
   * @param automationActionId 
   * @returns 
   */
  findChannelsByActionId = (automationActionId: string) => {
    return this.automationPrismaAdapter.findChannelsByAutomationActionId(automationActionId);
  }

  /**
   * Sends an email with a url to all users (who have an assigned dialogue) provided in an automation action
   * @param automationScheduleId
   * @param workspaceSlug
   * @returns a boolean indicating whether the call was a succes or not
   */
  sendDialogueLink = async (
    workspaceSlug: string,
    automationActionId: string
  ): Promise<boolean> => {
    const channels = await this.findChannelsByActionId(automationActionId);

    for (const channel of channels) {
      await this.handleSendDialogueChannel(channel, workspaceSlug)
    }
    return true;
  }

  /**
   * Send mails out to each recipient of the actions.
   * @param recipients List of users who receive the mail
   * @param workspaceSlug Workspace slug
   */
  async dispatchMailsToRecipients(recipients: UserOfCustomer[], workspaceSlug: string): Promise<void[]> {
    return await Promise.all(recipients.map(async (recipient) => {
      const user = await this.userPrismaAdapter.findPrivateDialogueOfUser(recipient.userId, workspaceSlug);
      if (!user) return;

      // TODO: Add support for multiple client URLs if a user is assinged to multipled dialogues
      const privateDialogues = user?.isAssignedTo;
      if (!privateDialogues?.length) {
        console.log('User ', user?.email, 'Is not assigned to a dialogue so cannot be sent dialogue url');
        return;
      };

      const targetDialogue = privateDialogues[0];

      mailService.send({
        body: makeDialogueLinkReminderTemplate({
          recipientMail: user.firstName || 'User',
          dialogueClientUrl: `${config.clientUrl}/${workspaceSlug}/${targetDialogue.slug}`,
        }),
        recipient: user.email,
        subject: 'A new HAAS survey has been released for your team',
      });
    }));
  }

  /**
   * Find recipients of all actions.
   * @param actionIds
   * @param workspaceSlug
   * @returns
   */
  async findActionsRecipients(actionIds: string[], workspaceSlug: string) {
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

    if (!automationAction) throw new ApolloError('No automation action found for ID!');

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
  handleReportEmailChannel = async (
    channel: AutomationActionChannel,
    workspaceSlug: string,
    reportUrl: string
  ) => {
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
   * Sends an email containing a dialogue client link to all recipients in the channel's payload
   * @param channel 
   * @param workspaceSlug 
   */
  handleSendDialogueEmailChannel = async (
    channel: AutomationActionChannel,
    workspaceSlug: string,
  ) => {
    const payload = (channel.payload as unknown) as GenerateReportPayload;
    const recipients = await this.userService.findTargetUsers(workspaceSlug, payload);
    await this.dispatchMailsToRecipients(recipients, workspaceSlug);
  }

  /**
   * Sends an client dialogue link to all recipients in the channel's payload based on the channel's type (e.g. EMAIL, SLACK etc.)
   * @param channel 
   * @param workspaceSlug 
   */
  handleSendDialogueChannel = async (
    channel: AutomationActionChannel,
    workspaceSlug: string,
  ) => {
    switch (channel.type) {
      case AutomationActionChannelType.EMAIL:
        await this.handleSendDialogueEmailChannel(channel, workspaceSlug);
        break;
      case AutomationActionChannelType.SMS:
        // TODO: Implement
        break;
      case AutomationActionChannelType.SLACK:
        // TODO: Implement
        break;
      default:
        await this.handleSendDialogueEmailChannel(channel, workspaceSlug);
        break;
    }
  }

  handleReportChannel = async (
    channel: AutomationActionChannel,
    workspaceSlug: string,
    reportUrl: string
  ) => {
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
   * Sends an email with a report to all users provided in an automation action
   * @param automationActionId
   * @param workspaceSlug
   * @param reportUrl
   * @returns
   */
  sendReport = async (automationActionId: string, workspaceSlug: string, reportUrl: string) => {
    const automationAction = await this.prisma.automationAction.findUnique({
      where: {
        id: automationActionId,
      },
      include: {
        channels: true,
      },
    });

    if (!automationAction) throw new ApolloError('No automation action found for ID!');

    for (const channel of automationAction.channels) {
      await this.handleReportChannel(channel, workspaceSlug, reportUrl);
    }

    return true;
  };

  /**
   * Send a report by going to the dashboard's report.
   * @param workspaceSlug
   * @param dialogueSlug
   * @returns
   */
  public async generateReport(
    automationActionId: string,
    workspaceSlug: string,
    dialogueSlug?: string
  ) {
    // Get bot user to create report with
    const botUser = await this.userService.findBotByWorkspaceName(workspaceSlug);

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

    return this.reportService.generateReport(reportInput);
  }
}
