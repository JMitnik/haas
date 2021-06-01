import { PrismaClient } from '@prisma/client';
import { CustomerPrismaAdapterType } from './CustomerPrismaAdapterType';
import { NexusGenInputs } from '../../generated/nexus';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';

export class CustomerPrismaAdapter implements CustomerPrismaAdapterType {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

 async findWorkspaceSettings(customerId: string) {
    return this.prisma.customerSettings.findOne({ where: { customerId } });
  }

  async createWorkspace(input: NexusGenInputs['CreateWorkspaceInput']) {
    console.log('Running from customer prisma adapter')
   return this.prisma.customer.create({
      data: {
        name: input.name,
        slug: input.slug,
        tags: { create: defaultWorkspaceTemplate.tags },
        settings: {
          create: {
            logoUrl: input.logo,
            colourSettings: {
              create: {
                primary: input.primaryColour || defaultWorkspaceTemplate.primaryColor,
              },
            },
          },
        },
        roles: { create: defaultWorkspaceTemplate.roles },
        dialogues: { create: [] },
      },
      include: {
        roles: true,
      },
    });
  }

}