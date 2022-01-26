import { PrismaClient } from '@prisma/client';

import UserService from '../users/UserService';
import config from '../../config/config';
import { ReportLambdaInput, ReportService } from '../../services/report/ReportService';

export class AutomationActionService {
  private prisma: PrismaClient;
  private userService: UserService;
  private reportService: ReportService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.userService = new UserService(prisma);
    this.reportService = new ReportService()
  }

  /**
   * Send a report by going to the dashboard's report.
   * @param workspaceSlug
   * @param dialogueSlug
   * @returns
   */
  public async generateReport(workspaceSlug: string, dialogueSlug?: string) {
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
    }

    return this.reportService.generateReport(reportInput);
  }
}
