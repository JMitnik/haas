import { Customer } from '@prisma/client';

import { UserInputError } from 'apollo-server-express';
// eslint-disable-next-line import/no-cycle
import { NexusGenInputs } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import DialogueService from '../questionnaire/DialogueService';
import NodeService from '../QuestionNode/NodeService';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import prisma from '../../config/prisma';

class CustomerService {
  static customers = async () => {
    const customers = prisma.customer.findMany();
    return customers;
  };

  static customerSettings = async (parent: Customer) => {
    const customerSettings = prisma.customerSettings.findOne({ where: { customerId: parent.id } });
    return customerSettings;
  };

  static customerBySlug = async (customerSlug: string) => {
    const customer = await prisma.customer.findOne({ where: { slug: customerSlug } });

    if (!customer) {
      throw new Error(`Unable to find customer ${customerSlug}!`);
    }

    return customer;
  };

  static seedByTemplate = async (customer: Customer, template: WorkspaceTemplate = defaultWorkspaceTemplate, willGenerateFakeData: boolean = false) => {
    // Step 1: Make dialogue
    const dialogue = await prisma.dialogue.create({
      data: {
        customer: {
          connect: {
            id: customer.id,
          },
        },
        slug: template.slug,
        title: template.title,
        description: template.description,
        questions: {
          create: [],
        },
      },
    });

    // Step 2: Make the leafs
    const leafs = await NodeService.createTemplateLeafNodes(template.leafNodes, dialogue.id);

    // Step 3: Make nodes
    await NodeService.createTemplateNodes(dialogue.id, customer.name, leafs);

    // Step 4: possibly
    if (willGenerateFakeData) {
      await DialogueService.generateFakeData(dialogue.id, template);
    }
  };

  static editWorkspace = async (input: NexusGenInputs['EditWorkspaceInput']) => {
    const customerSettings = await prisma.customerSettings.update({
      where: {
        customerId: input.id,
      },
      data: {
        logoUrl: input.logo,
        logoOpacity: input.logoOpacity ?? 30,
      },
    });

    await prisma.colourSettings.update({
      where: {
        id: customerSettings.colourSettingsId || undefined,
      },
      data: {
        primary: input.primaryColour,
      },
    });

    const customer = await prisma.customer.update({
      where: {
        id: input.id,
      },
      data: {
        slug: input.slug,
        name: input.name,
      },
    });

    return customer;
  };

  static createWorkspace = async (input: NexusGenInputs['CreateWorkspaceInput'], createdUserId?: string) => {
    try {
      const customer = await prisma.customer.create({
        data: {
          name: input.name,
          slug: input.slug,
          tags: { create: defaultWorkspaceTemplate.tags },
          settings: {
            create: {
              logoUrl: input.logo,
              logoOpacity: input.logoOpacity ?? 0.3,
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

      if (input.isSeed) {
        await CustomerService.seedByTemplate(customer, defaultWorkspaceTemplate, input.willGenerateFakeData || false);
      }

      // If customer is created by user, make them an "Admin"
      if (createdUserId) {
        const adminRole = customer.roles.find((role) => role.type === 'ADMIN');

        await prisma.userOfCustomer.create({
          data: {
            customer: { connect: { id: customer.id } },
            role: { connect: { id: adminRole?.id } },
            user: { connect: { id: createdUserId } },
          },
        });
      }

      return customer;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UserInputError('customer:existing_slug');
      }

      return null;
    }
  };

  /**
   * Gets a dialogue from the customer, by using a slug
   * @param customerId
   * @param dialogueSlug
   */
  static async getDialogueFromCustomerBySlug(customerId: string, dialogueSlug: string) {
    const customerWithDialogue = await prisma.customer.findOne({
      where: { id: customerId },
      include: {
        dialogues: {
          where: { slug: dialogueSlug },
        },
      },
    });

    return customerWithDialogue?.dialogues?.[0];
  }

  static async deleteCustomer(customerId: string) {
    if (!customerId) return null;

    const customer = await prisma.customer.findOne({
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

    if (!customer) return null;

    const colourSettingsId = customer?.settings?.colourSettingsId;
    const fontSettingsId = customer?.settings?.fontSettingsId;

    // //// Settings-related
    if (fontSettingsId) {
      await prisma.fontSettings.delete({
        where: {
          id: fontSettingsId,
        },
      });
    }

    if (colourSettingsId) {
      await prisma.colourSettings.delete({
        where: {
          id: colourSettingsId,
        },
      });
    }

    if (customer?.settings) {
      await prisma.customerSettings.delete({
        where: {
          customerId,
        },
      });
    }

    const dialogueIds = await prisma.dialogue.findMany({
      where: {
        customerId,
      },
      select: {
        id: true,
      },
    });

    if (dialogueIds.length > 0) {
      await Promise.all(dialogueIds.map(async (dialogueId) => {
        await DialogueService.deleteDialogue(dialogueId.id);
      }));
    }

    const deletionOfTags = prisma.tag.deleteMany({ where: { customerId } });
    const deletionOfTriggers = prisma.triggerCondition.deleteMany({ where: { trigger: { customerId } } });
    const deletionOfPermissions = prisma.permission.deleteMany({ where: { customerId } });
    const deletionOfUserCustomerRoles = prisma.userOfCustomer.deleteMany({
      where: {
        customerId,
      },
    });

    const deletionOfRoles = prisma.role.deleteMany({ where: { customerId } });
    const deletionOfCustomer = prisma.customer.delete({ where: { id: customerId } });

    await prisma.$transaction([
      deletionOfTags,
      deletionOfTriggers,
      deletionOfPermissions,
      deletionOfUserCustomerRoles,
      deletionOfRoles,
      deletionOfCustomer,
    ]);

    return customer || null;
  }

  /**
   * Gets a dialogue from the customer, by using an ID
   * @param customerId
   * @param dialogueSlug
   */
  static async getDialogueFromCustomerById(customerId: string, dialogueId: string) {
    const customerWithDialogue = await prisma.customer.findOne({
      where: { id: customerId },
      include: {
        dialogues: {
          where: { id: dialogueId },
        },
      },
    });

    return customerWithDialogue?.dialogues?.[0];
  }
}

export default CustomerService;
