import { Customer, TagCreateWithoutCustomerInput } from '@prisma/client';
import { subDays } from 'date-fns';
import cuid from 'cuid';

import { UserInputError } from 'apollo-server-express';
import { leafNodes } from '../../data/seeds/default-data';
// eslint-disable-next-line import/no-cycle
import DialogueService from '../questionnaire/DialogueService';
import NodeService from '../question/NodeService';
import prisma from '../../config/prisma';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const seedCustomerData: TagCreateWithoutCustomerInput[] = [
  {
    name: 'Agent',
    type: 'AGENT',
  },
  {
    name: 'Amsterdam',
    type: 'LOCATION',
  },
  {
    name: 'Marketing strategy #131',
    type: 'DEFAULT',
  },
];

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

  static seed = async (customer: Customer) => {
    // Step 1: Make dialogue
    const dialogue = await prisma.dialogue.create({
      data: {
        customer: {
          connect: {
            id: customer.id,
          },
        },
        slug: 'default',
        title: 'Default dialogue',
        description: 'Default questions',
        questions: {
          create: [],
        },
      },
    });

    // Step 2: Make the leafs
    const leafs = await NodeService.createTemplateLeafNodes(leafNodes, dialogue.id);

    // Step 3: Make nodes
    await NodeService.createTemplateNodes(dialogue.id, customer.name, leafs);

    // Step 4: Fill with random data
    const currentDate = new Date();
    const amtOfDaysBack = Array.from(Array(30)).map((empty, index) => index + 1);
    const datesBackInTime = amtOfDaysBack.map((amtDaysBack) => subDays(currentDate, amtDaysBack));
    const options = ['Facilities', 'Website/Mobile app', 'Product/Services', 'Customer support'];

    const dialogueWithNodes = await prisma.dialogue.findOne({
      where: { id: dialogue.id },
      include: {
        questions: true,
        edges: {
          include: {
            conditions: true,
            childNode: true,
          },
        },
      },
    });

    const rootNode = dialogueWithNodes?.questions.find((node) => node.isRoot);
    const edgesOfRootNode = dialogueWithNodes?.edges.filter((edge) => edge.parentNodeId === rootNode?.id);

    // Stop if no rootnode
    if (!rootNode) return;

    await Promise.all(datesBackInTime.map(async (backDate) => {
      const simulatedRootVote: number = getRandomInt(100);

      const simulatedChoice = options[Math.floor(Math.random() * options.length)];
      const simulatedChoiceEdge = edgesOfRootNode?.find((edge) => edge.conditions.every((condition) => {
        if (!condition.renderMin || !condition.renderMax) return false;
        const isValid = condition?.renderMin < simulatedRootVote && condition?.renderMax > simulatedRootVote;

        return isValid;
      }));

      const simulatedChoiceNodeId = simulatedChoiceEdge?.childNode.id;

      if (!simulatedChoiceNodeId) return;

      await prisma.session.create({
        data: {
          nodeEntries: {
            create: [{
              depth: 0,
              creationDate: backDate,
              relatedNode: {
                connect: { id: rootNode.id },
              },
              sliderNodeEntry: {
                create: { value: simulatedRootVote },
              },
            },
            {
              depth: 1,
              creationDate: backDate,
              relatedNode: { connect: { id: simulatedChoiceNodeId } },
              relatedEdge: { connect: { id: simulatedChoiceEdge?.id } },
              choiceNodeEntry: {
                create: { value: simulatedChoice },
              },
            },
            ],
          },
          dialogue: {
            connect: { id: dialogue.id },
          },
        },
      });
    }));
  };

  static editCustomer = async (args: any) => {
    const { id, options } = args;
    const { logo, primaryColour, slug, name } = options;
    const customerSettings = await prisma.customerSettings.update({
      where: {
        customerId: id,
      },
      data: {
        logoUrl: logo,
      },
    });

    await prisma.colourSettings.update({
      where: {
        id: customerSettings.colourSettingsId || undefined,
      },
      data: {
        primary: primaryColour,
      },
    });

    const customer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        slug,
        name,
      },
    });

    return customer;
  };

  static createCustomer = async (args: any) => {
    const { name, options } = args;
    const { isSeed, logo, primaryColour, slug } = options;

    try {
      const customer = await prisma.customer.create({
        data: {
          name,
          slug,
          tags: {
            create: seedCustomerData,
          },
          settings: {
            create: {
              logoUrl: logo,
              colourSettings: {
                create: {
                  primary: primaryColour || '#4287f5',
                },
              },
            },
          },
          roles: {
            create: [
              {
                name: 'Admin',
                roleId: cuid(),
              },
              {
                name: 'Normal',
                roleId: cuid(),
              },
              {
                name: 'Custom role',
                roleId: cuid(),
              },
            ],
          },
          dialogues: {
            create: [],
          },
        },
      });

      if (isSeed) {
        await CustomerService.seed(customer);
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

    await prisma.tag.deleteMany({ where: { customerId } });
    await prisma.triggerCondition.deleteMany({ where: { trigger: { customerId } } });
    await prisma.trigger.deleteMany({ where: { customerId } });
    await prisma.permission.deleteMany({ where: { customerId } });
    await prisma.user.deleteMany({ where: { customers: { every: { customer: { id: customerId } } } } });
    await prisma.role.deleteMany({ where: { customerId } });

    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

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
