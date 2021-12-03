import { PrismaClient } from '@prisma/client';
import { AutomationPrismaAdapter } from './AutomationPrismaAdapter';

class AutomationService {
  prisma: PrismaClient;
  automationPrismaAdapter: AutomationPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
  }

}

export default AutomationService;
