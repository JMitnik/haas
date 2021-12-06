import { PrismaClient } from '@prisma/client';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';

class AutomationService {
  automationPrismaAdapter: AutomationPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
  }

  findAutomationById = (automationId: string) => {
    return this.automationPrismaAdapter.findAutomationById(automationId);
  }

  findWorkspaceByAutomation = (automationId: string) => {
    return this.automationPrismaAdapter.findWorkspaceByAutomationId(automationId);
  };

  findAutomationsByWorkspace = (workspaceId: string) => {
    return this.automationPrismaAdapter.findAutomationsByWorkspaceId(workspaceId);
  };

}

export default AutomationService;
