import { PrismaClient, Dialogue, CustomerUpdateInput, Customer, Tag } from '@prisma/client';
import { CustomerPrismaAdapterType } from './CustomerPrismaAdapterType';
import { NexusGenInputs } from '../../generated/nexus';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';

export class CustomerPrismaAdapter implements CustomerPrismaAdapterType {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findWorkspaceBySlug(slug: string): Promise<Customer | null> {
    return this.prisma.customer.findOne({ where: { slug } });
  }

  findWorkspaceById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findOne({ where: { id } });
  }

  async findAll() {
    return this.prisma.customer.findMany();
  }

  
  async findWorkspaceBySlugs(slugs: Array<string|undefined>): Promise<Customer | null> {
    const filteredSlugs: any = slugs.filter((slug) => slug);
    return this.prisma.customer.findFirst({
      where: {
        slug: {
          in: filteredSlugs,
        },
      },
    });
  }
  
  async exists(customerId: string): Promise<Boolean> {
    const customerExists = await this.prisma.customer.findFirst({
      where: { id: customerId }
    });
    
    return customerExists ? true : false;
  }

  async getAllCustomersBySlug(customerSlug?: string | null) {
    return this.prisma.customer.findMany({
      where: {
        slug: customerSlug || undefined
      }
    })
  }
 
  async getDialogueTags(customerSlug: string, dialogueSlug: string) {
    const customer = await this.prisma.customer.findOne({
      where: {
        slug: customerSlug,
      },
      select: {
        dialogues: {
          where: {
            slug: dialogueSlug,
          },
          include: {
            tags: true,
          },
        },
      },
    });
    const dbDialogue = customer?.dialogues[0];
    return dbDialogue;
  }

  delete(customerId: string): Promise<Customer> {
    return this.prisma.customer.delete({ where: { id: customerId } });
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