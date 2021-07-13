import { Customer, PrismaClient, PrismaClientOptions, prismaVersion, CustomerSettingsUpdateInput, CustomerUpdateInput, CustomerSettings } from '@prisma/client';

import { UserInputError } from 'apollo-server-express';
// eslint-disable-next-line import/no-cycle
import { NexusGenInputs } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import DialogueService from '../questionnaire/DialogueService';
import NodeService from '../QuestionNode/NodeService';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import prisma from '../../config/prisma';
import { CustomerServiceType } from './CustomerServiceType';
import { CustomerPrismaAdapterType } from './CustomerPrismaAdapterType';
import { CustomerPrismaAdapter } from './CustomerPrismaAdapter';
import { CustomerSettingsPrismaAdapterType } from '../settings/CustomerSettingsPrismaAdapterType';
import CustomerSettingsPrismaAdapter from '../settings/CustomerSettingsPrismaAdapter';
import ColourSettingsPrismaAdapter from '../settings/ColourSettingsPrismaAdapter';
import { ColourSettingsPrismaAdapterType } from '../settings/ColourSettingsPrismaAdapterType';
import { FontSettingsPrismaAdapterType } from '../settings/FontSettingsPrismaAdapterType';
import FontSettingsPrismaAdapter from '../settings/FontSettingsPrismaAdapter';
import { DialogueServiceType } from '../questionnaire/DialogueServiceType';
import { TagPrismaAdapterType } from '../tag/TagPrismaAdapterType';
import TagPrismaAdapter from '../tag/TagPrismaAdapter';
import { DialoguePrismaAdapterType } from '../questionnaire/DialoguePrismaAdapterType';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { UserOfCustomerPrismaAdapterType } from '../users/UserOfCustomerPrismaAdapterType';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { NodeServiceType } from '../QuestionNode/NodeServiceType';

class CustomerService implements CustomerServiceType {
  customerPrismaAdapter: CustomerPrismaAdapterType;
  customerSettingsPrismaAdapter: CustomerSettingsPrismaAdapterType;
  colourSettingsPrismaAdater: ColourSettingsPrismaAdapterType;
  fontSettingsPrismaAdapter: FontSettingsPrismaAdapterType;
  tagPrismaAdapter: TagPrismaAdapterType;
  dialogueService: DialogueServiceType;
  dialoguePrismaAdapter: DialoguePrismaAdapterType;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapterType;
  nodeService: NodeServiceType;

  constructor(prismaClient: PrismaClient<PrismaClientOptions, never>) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.customerSettingsPrismaAdapter = new CustomerSettingsPrismaAdapter(prismaClient)
    this.colourSettingsPrismaAdater = new ColourSettingsPrismaAdapter(prismaClient);
    this.fontSettingsPrismaAdapter = new FontSettingsPrismaAdapter(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
    this.tagPrismaAdapter = new TagPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
  }
  getColourSettings(colourSettingsId: number) {
    return this.colourSettingsPrismaAdater.getById(colourSettingsId);
  }
  getFontSettings(fontSettingsId: number) {
    return this.fontSettingsPrismaAdapter.getById(fontSettingsId);
  }

  findWorkspaceBySlug(slug: string): Promise<Customer | null> {
    return this.customerPrismaAdapter.findWorkspaceBySlug(slug);
  }

  findWorkspaceById(id: string): Promise<Customer | null> {
    return this.customerPrismaAdapter.findWorkspaceById(id);
  }

  async findAll() {
    return this.customerPrismaAdapter.findAll();
  }

  getCustomerSettingsByCustomerId(customerId: string): Promise<CustomerSettings | null> {
    return this.customerSettingsPrismaAdapter.getCustomerSettingsByCustomerId(customerId);
  }

  findWorkspaceBySlugs(slugs: (string | undefined)[]) {
    return this.customerPrismaAdapter.findWorkspaceBySlugs(slugs);
  }


  async delete(customerId: string): Promise<Customer> {
    return this.customerPrismaAdapter.delete(customerId);
  }

  seedByTemplate = async (customer: Customer, template: WorkspaceTemplate = defaultWorkspaceTemplate, willGenerateFakeData: boolean = false) => {
    // Step 1: Make dialogue
    const dialogue = await this.dialoguePrismaAdapter.create({
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
    })

    // Step 2: Make the leafs
    const leafs = await this.nodeService.createTemplateLeafNodes(template.leafNodes, dialogue.id);

    // Step 3: Make nodes
    await this.nodeService.createTemplateNodes(dialogue.id, customer.name, leafs);

    // Step 4: possibly
    if (willGenerateFakeData) {
      await this.dialogueService.generateFakeData(dialogue.id, template);
    }
  };

  editWorkspace = async (input: NexusGenInputs['EditWorkspaceInput']) => {
    const { id, name, slug, primaryColour, logo } = input;
    const customerInputData: CustomerUpdateInput = {
      name,
      slug,
      settings: {
        update: {
          logoUrl: logo,
          colourSettings: {
            update: {
              primary: primaryColour
            }
          }
        }
      }
    };
    const customer = await this.customerPrismaAdapter.updateCustomer(id, customerInputData);

    return customer;
  };

  createWorkspace = async (input: NexusGenInputs['CreateWorkspaceInput'], createdUserId?: string) => {
    try {
      const customer = await this.customerPrismaAdapter.createWorkspace(input);

      if (input.isSeed) {
        await this.seedByTemplate(customer, defaultWorkspaceTemplate, input.willGenerateFakeData || false);
      }

      // If customer is created by user, make them an "Admin"
      if (createdUserId) {
        const adminRole = customer.roles.find((role) => role.type === 'ADMIN');

        await this.userOfCustomerPrismaAdapter.create(
          {
            customer: { connect: { id: customer.id } },
            role: { connect: { id: adminRole?.id } },
            user: { connect: { id: createdUserId } },
          },
        );
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
  async getDialogueBySlug(customerId: string, dialogueSlug: string) {
    const dialogueOfWorkspace = await this.customerPrismaAdapter.getDialogueBySlug(customerId, dialogueSlug);
    return dialogueOfWorkspace;
  }


  // TODO: Use adapters for everything but Customer
  async deleteWorkspace(customerId: string) {
    if (!customerId) return null;

    const customer = await this.customerPrismaAdapter.getCustomer(customerId);

    if (!customer) return null;

    const colourSettingsId = customer?.settings?.colourSettingsId;
    const fontSettingsId = customer?.settings?.fontSettingsId;

    // //// Settings-related
    if (fontSettingsId) {
      await this.fontSettingsPrismaAdapter.delete(fontSettingsId);
    }

    if (colourSettingsId) {
      await this.colourSettingsPrismaAdater.delete(colourSettingsId);
    }

    if (customer?.settings) {
      await this.customerSettingsPrismaAdapter.deleteByCustomerId(customerId);
    }

    const dialogueIds = await this.dialogueService.findDialogueIdsByCustomerId(customerId);

    if (dialogueIds.length > 0) {
      await Promise.all(dialogueIds.map(async (dialogueId) => {
        // TODO: Rewrite this function so it uses adapter
        await this.dialogueService.deleteDialogue(dialogueId);
      }));
    }

    // FIXME: Makes this somehow part of the transaction. How to return Promise instead of resolved value (=object)? @JMitnik
    const deleteTagsTest = this.tagPrismaAdapter.deleteAllByCustomerId(customerId);
    const deletionOfTags = prisma.tag.deleteMany({ where: { customerId } });
    const deletionOfTriggers = prisma.triggerCondition.deleteMany({ where: { trigger: { customerId } } });
    const deletionOfPermissions = prisma.permission.deleteMany({ where: { customerId } });
    const deletionOfUserCustomerRoles = prisma.userOfCustomer.deleteMany({
      where: {
        customerId,
      },
    });

    const deletionOfRoles = prisma.role.deleteMany({ where: { customerId } });
    const deletionOfCustomer = this.customerPrismaAdapter.delete(customerId);

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
  async getDialogueById(customerId: string, dialogueId: string) {
    return this.customerPrismaAdapter.getDialogueById(customerId, dialogueId);
  }
}

export default CustomerService;
