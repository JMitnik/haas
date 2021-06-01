import { PrismaClient, Dialogue, CustomerUpdateInput, Customer } from '@prisma/client';
import { CustomerPrismaAdapterType } from './CustomerPrismaAdapterType';
import { NexusGenInputs } from '../../generated/nexus';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';

export class CustomerPrismaAdapter implements CustomerPrismaAdapterType {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async getDialogueById(customerId: string, dialogueId: string): Promise<Dialogue | undefined> {
    const customerWithDialogue = await this.prisma.customer.findOne({
      where: { id: customerId },
      include: {
        dialogues: {
          where: { id: dialogueId },
        },
      },
    });

    return customerWithDialogue?.dialogues?.[0];
  }
  async getCustomer(customerId: string){
    return this.prisma.customer.findOne({
      where: { id: customerId },
      include: {
        settings: {
          include: {
            colourSettings: true,
            fontSettings: true,
          },
        },
      },
    });
  }

  async updateCustomer(customerId: string, input: CustomerUpdateInput): Promise<Customer> {
    console.log('updating through adapter');
    const customer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: input,
    });

    return customer;
  };

  async getDialogueBySlug(customerId: string, dialogueSlug: string): Promise<Dialogue | undefined> {
    const customerWithDialogue = await this.prisma.customer.findOne({
      where: { id: customerId },
      include: {
        dialogues: {
          where: { slug: dialogueSlug },
        },
      },
    });

    return customerWithDialogue?.dialogues?.[0];
  }

 async findWorkspaceSettings(customerId: string) {
    return this.prisma.customerSettings.findOne({ where: { customerId } });
  }

  async createWorkspace(input: NexusGenInputs['CreateWorkspaceInput']) {
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