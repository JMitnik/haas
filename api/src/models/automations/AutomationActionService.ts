import { AutomationActionType, PrismaClient } from '@prisma/client';
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
   * Sends an email with a url to all users (who have an assigned dialogue) provided in an automation action
   * @param automationScheduleId
   * @param workspaceSlug
   * @returns a boolean indicating whether the call was a succes or not
   */
  sendDialogueLink = async (automationScheduleId: string, workspaceSlug: string) => {
    const scheduledAutomation = await this.automationPrismaAdapter.findScheduledAutomationById(automationScheduleId);
    const sendEmailActions = scheduledAutomation?.actions.filter(
      (action) => action.type === AutomationActionType.SEND_EMAIL
    ) || [];

    if (!sendEmailActions.length) {
      console.log('No email actions available for: ', automationScheduleId, '. Abort.');
      return false;
    };
    const actionIds = sendEmailActions.map((action) => action.id);

    const recipients = await Promise.all(actionIds.map(async (actionId) => {
      const actionRecipients = await this.findRecipients(actionId, workspaceSlug);
      return actionRecipients;
    }));

    const flattenedRecipients = recipients.flat();
    const uniqueFlattenedRecipients = uniqBy(flattenedRecipients, (recipient) => recipient.user.email);

    await Promise.all(uniqueFlattenedRecipients.map(async (recipient) => {
      const user = await this.userPrismaAdapter.findPrivateDialogueOfUser(recipient.userId, workspaceSlug);

      // TODO: Add support for multiple client URLs if a user is assinged to multipled dialogues
      const privateDialogues = user?.isAssignedTo;
      if (!privateDialogues?.length) {
        console.log('User ', user?.email, 'Is not assigned to a dialogue so cannot be sent dialogue url');
        return;
      };

      const targetDialogue = privateDialogues[0];
      const constructedDialogueLink = `${config.clientUrl}/${workspaceSlug}/${targetDialogue.slug}`
      const triggerBody = makeDialogueLinkReminderTemplate(
        {
          recipientMail: recipient.user.firstName || 'User',
          dialogueClientUrl: constructedDialogueLink,
        }
      );

      mailService.send({
        body: triggerBody,
        recipient: recipient.user.email,
        subject: 'A new HAAS survey has been released for your team',
      });
    }));

    return true;
  }

  /**
   * Finds all recipients for an automation action
   * @param automationActionId
   * @param workspaceSlug
   * @returns
   */
  findRecipients = async (automationActionId: string, workspaceSlug: string) => {
    const automationAction = await this.prisma.automationAction.findUnique({
      where: {
        id: automationActionId,
      },
    });

    if (!automationAction) throw new ApolloError('No automation action found for ID!');

    const payload = (automationAction.payload as unknown) as GenerateReportPayload;
    const users = await this.userService.findTargetUsers(workspaceSlug, payload);

    return users;
  }

  /**
   * Sends an email with a report to all users provided in an automation action
   * @param automationActionId
   * @param workspaceSlug
   * @param reportUrl
   * @returns
   */
  sendReport = async (automationActionId: string, workspaceSlug: string, reportUrl: string) => {
    const recipients = await this.findRecipients(automationActionId, workspaceSlug);
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
    targets: string[],
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
      TARGETS: targets,
      WORKSPACE_SLUG: workspaceSlug,
      USER_ID: botUser?.id as string,
      AUTOMATION_ACTION_ID: automationActionId,
    }

    return this.reportService.generateReport(reportInput);
  }
}
