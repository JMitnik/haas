import { Customer, PrismaClient, PrismaClientOptions, prismaVersion, CustomerSettingsUpdateInput, CustomerUpdateInput, CustomerSettings } from '@prisma/client';

import { UserInputError } from 'apollo-server-express';
// eslint-disable-next-line import/no-cycle
import { NexusGenInputs } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import DialogueService from '../questionnaire/DialogueService';
import NodeService from '../QuestionNode/NodeService';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import prisma from '../../config/prisma';
import { CustomerPrismaAdapter } from './CustomerPrismaAdapter';
import TagPrismaAdapter from '../tag/TagPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { UpdateCustomerInput } from './CustomerServiceType';

class CustomerService {
  customerPrismaAdapter: CustomerPrismaAdapter;
  tagPrismaAdapter: TagPrismaAdapter;
  dialogueService: DialogueService;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;
  nodeService: NodeService;

  constructor(prismaClient: PrismaClient<PrismaClientOptions, never>) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
    this.tagPrismaAdapter = new TagPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
  }

  async getDialogue(customerId: string, dialogueSlug: string) {
    const customer = await prisma.customer.findOne({
      where: {
        id: customerId || undefined,
      },
      include: {
        dialogues: {
          where: {
            slug: dialogueSlug,
          },
          include: {
            questions: {
              select: {
                id: true,
              },
            },
            edges: {
              select: {
                id: true,
                parentNodeId: true,
                childNodeId: true,
              },
            },
          },
        },
      },
    });

    const dialogue = customer?.dialogues[0];
    return dialogue;
  }

  getColourSettings(colourSettingsId: number) {
    return this.customerPrismaAdapter.getColourSettingsById(colourSettingsId);
  }
  getFontSettings(fontSettingsId: number) {
    return this.customerPrismaAdapter.getFontSettingsById(fontSettingsId);
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
    return this.customerPrismaAdapter.getCustomerSettingsByCustomerId(customerId);
  }

  findWorkspaceBySlugs(slugs: (string | undefined)[]) {
    return this.customerPrismaAdapter.findWorkspaceBySlugs(slugs);
  }


  async delete(customerId: string): Promise<Customer> {
    return this.customerPrismaAdapter.delete(customerId);
  }

  seedByTemplate = async (customer: Customer, template: WorkspaceTemplate = defaultWorkspaceTemplate, willGenerateFakeData: boolean = false) => {
    // Step 1: Make dialogue
    const dialogueInput = { slug: template.slug, title: template.title, description: template.description, customerId: customer.id };
    const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);
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
    const customerInputData: UpdateCustomerInput = {
      name,
      slug,
      logoUrl: logo,
      primaryColour: primaryColour,
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

        await this.userOfCustomerPrismaAdapter.connectUserToWorkspace(customer.id, adminRole?.id || '', createdUserId)
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

  async deleteWorkspace(customerId: string) {
    if (!customerId) return null;

    const customer = await this.customerPrismaAdapter.getCustomer(customerId);

    if (!customer) return null;

    const colourSettingsId = customer?.settings?.colourSettingsId;
    const fontSettingsId = customer?.settings?.fontSettingsId;

    // //// Settings-related
    if (fontSettingsId) {
      await this.customerPrismaAdapter.deleteFontSettings(fontSettingsId);
    }

    if (colourSettingsId) {
      await this.customerPrismaAdapter.deleteColourSettings(colourSettingsId);
    }

    if (customer?.settings) {
      await this.customerPrismaAdapter.deleteCustomerSettingByCustomerId(customerId);
    }

    const dialogueIds = await this.dialogueService.findDialogueIdsByCustomerId(customerId);

    if (dialogueIds.length > 0) {
      await Promise.all(dialogueIds.map(async (dialogueId) => {
        await this.dialogueService.deleteDialogue(dialogueId);
      }));
    }

    // FIXME: Makes this somehow part of the transaction. How to return Promise instead of resolved value (=object)? @JMitnik
    // TODO: ADD Campaign, CampaignVariant, CampaignVariantToCampaign, ChoiceNodeEntry, CreateWorkspaceJob, CustomField, 
    // TODO: Add Delivery, DeliveryEvents, FormNode, FormNodeEntry, FormNodeField, FormNodeFieldEntryData, Job, JobProcessLocation
    // TODO: Add Link, LinkNodeEntry, NodeEntry, PostLeafNode, QuestionCondition, QuestionNode, QuestionOfTrigger, QuestionOption
    // TODO: RegistrationNodeEntry, Session, Share, SliderNode, SliderNodeEntry, SliderNodeMarker, SliderNodeRange, TextboxNodeEntry
    // TODO: Trigger, User, VideoEmbeddedNode, VideoNodeEntry, 
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
