import { PrismaClient, Dialogue, Customer, Tag, CustomerSettings, ColourSettings, FontSettings, DialogueImpactScore } from '@prisma/client';
import WorkspaceTemplate, { DemoWorkspaceTemplate } from 'models/templates/TemplateTypes';

import { NexusGenInputs } from '../../generated/nexus';
import defaultWorkspaceTemplate from '../templates/defaultWorkspaceTemplate';
import { UpdateCustomerInput } from './CustomerServiceType';

export class CustomerPrismaAdapter {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Find all the private dialogues within a workspace
   * @param workspaceId 
   * @returns a list of private dialogues
   */
  findPrivateDialoguesOfWorkspace = async (workspaceId?: string, workspaceSlug?: string) => {
    return this.prisma.customer.findUnique({
      where: {
        id: workspaceId || undefined,
        slug: workspaceSlug || undefined,
      },
      include: {
        dialogues: {
          where: {
            isPrivate: true,
          },
        },
      },
    });
  }

  async deleteFontSettings(fontSettingsId: number): Promise<FontSettings> {
    return this.prisma.fontSettings.delete({
      where: {
        id: fontSettingsId,
      },
    });
  };

  getFontSettingsById(fontSettingsId: number): Promise<FontSettings | null> {
    return this.prisma.fontSettings.findUnique({
      where: { id: fontSettingsId },
    });
  };

  async deleteColourSettings(colourSettingsId: number): Promise<ColourSettings> {
    return this.prisma.colourSettings.delete({
      where: {
        id: colourSettingsId,
      },
    });
  };

  getColourSettingsById(colourSettingsId: number) {
    return this.prisma.colourSettings.findUnique({
      where: { id: colourSettingsId },
    });
  };

  async deleteCustomerSettingByCustomerId(customerId: string): Promise<CustomerSettings> {
    return this.prisma.customerSettings.delete({
      where: {
        customerId,
      },
    });
  };

  async getCustomerSettingsByCustomerId(customerId: string) {
    return this.prisma.customerSettings.findUnique({
      where: { customerId },
    });
  };

  async getTagsByCustomerSlug(customerSlug: string): Promise<Tag[]> {
    const customer = await this.prisma.customer.findUnique({
      where: { slug: customerSlug },
      include: {
        tags: true,
      },
    });

    return customer?.tags || [];
  };

  findWorkspaceBySlug(slug: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { slug } });
  };

  findWorkspaceById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id: id },
      include: {
        settings: {
          include: {
            colourSettings: true,
            fontSettings: true,
          },
        },
      },
    });
  };

  async findAll() {
    return this.prisma.customer.findMany();
  };

  async findWorkspaceBySlugs(slugs: Array<string | undefined>): Promise<Customer | null> {
    const filteredSlugs: any = slugs.filter((slug) => slug);
    return this.prisma.customer.findFirst({
      where: {
        OR: [{
          slug: {
            in: filteredSlugs,
          },
        },
        {
          id: {
            in: filteredSlugs,
          },
        }],
      },
    });
  };

  async exists(customerId: string): Promise<Boolean> {
    const customerExists = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    return customerExists ? true : false;
  };

  async getAllCustomersBySlug(customerSlug?: string | null) {
    return this.prisma.customer.findMany({
      where: {
        slug: customerSlug || undefined,
      },
    });
  };

  async getDialogueTags(customerSlug: string, dialogueSlug: string) {
    const customer = await this.prisma.customer.findUnique({
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
            postLeafNode: true,
          },
        },
      },
    });
    const dbDialogue = customer?.dialogues[0];
    return dbDialogue;
  };

  delete(customerId: string) {
    return this.prisma.customer.delete({ where: { id: customerId } });
  };

  async getDialogueById(customerId: string, dialogueId: string): Promise<Dialogue | undefined> {
    const customerWithDialogue = await this.prisma.customer.findFirst({
      where: { id: customerId },
      include: {
        dialogues: {
          where: { id: dialogueId },
        },
      },
    });

    return customerWithDialogue?.dialogues?.[0];
  };

  async updateCustomer(customerId: string, input: UpdateCustomerInput) {
    const customer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        name: input.name,
        slug: input.slug,
        settings: (input.primaryColour || input.logoUrl) ? {
          update: {
            logoUrl: input.logoUrl,
            logoOpacity: input.logoOpacity,
            colourSettings: input.primaryColour ? {
              update: {
                primary: input.primaryColour,
              },
            } : undefined,
          },
        } : undefined,
      },
      include: {
        settings: {
          include: {
            colourSettings: true,
            fontSettings: true,
          },
        },
      },
    });

    return customer;
  };

  async getDialogueBySlug(customerId: string, dialogueSlug: string): Promise<Dialogue | undefined> {
    const customerWithDialogue = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        dialogues: {
          where: { slug: dialogueSlug },
        },
      },
    });

    return customerWithDialogue?.dialogues?.[0];
  }

  async createWorkspace(input: NexusGenInputs['CreateWorkspaceInput'], template: WorkspaceTemplate | DemoWorkspaceTemplate = defaultWorkspaceTemplate) {
    return this.prisma.customer.create({
      data: {
        name: input.name,
        slug: input.slug,
        tags: { create: template.tags },
        settings: {
          create: {
            logoUrl: input.logo || '',
            logoOpacity: input.logoOpacity || 30,
            colourSettings: {
              create: {
                primary: input.primaryColour || template.primaryColor,
              },
            },
          },
        },
        roles: { create: template.roles },
        dialogues: { create: [] },
      },
      include: {
        roles: true,
      },
    });
  };

};
