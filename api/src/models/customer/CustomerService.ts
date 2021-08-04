import { Customer, PrismaClient, PrismaClientOptions, CustomerSettings } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';

import { NexusGenInputs } from '../../generated/nexus';
import DialogueService from '../questionnaire/DialogueService';
import NodeService from '../QuestionNode/NodeService';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import prisma from '../../config/prisma';
import { CustomerPrismaAdapter } from './CustomerPrismaAdapter';
import TagPrismaAdapter from '../tag/TagPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { UpdateCustomerInput } from './CustomerServiceType';
import { CreateDialogueInput } from '../questionnaire/DialoguePrismaAdapterType';

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

  /**
   * Get a dialogue based on workspace ID and dialogue Slug. 
   * @param customerId Workspace ID
   * @param dialogueSlug Dialogue Slug
   * @returns A dialogue including question Ids and edges 
   */
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

  /**
   * Finds the colour settings based on ID
   * @param colourSettingsId the ID of the colour settings entry 
   * @returns ColourSettings prisma entry
   */
  getColourSettings(colourSettingsId: number) {
    return this.customerPrismaAdapter.getColourSettingsById(colourSettingsId);
  }

  /**
   * Finds the font settings based on ID
   * @param fontSettingsId the ID of the font settings entry
   * @returns FontSettings prisma entry
   */
  getFontSettings(fontSettingsId: number) {
    return this.customerPrismaAdapter.getFontSettingsById(fontSettingsId);
  }

  /**
   * Finds workspace by workspace slug
   * @param slug Workspace slug
   * @returns A workspace matching the provided slug
   */
  findWorkspaceBySlug(slug: string): Promise<Customer | null> {
    return this.customerPrismaAdapter.findWorkspaceBySlug(slug);
  }

  /**
   * Finds workspace by workspace ID
   * @param id Finds workspace by workspace ID
   * @returns A workspace matching the provided ID
   */
  findWorkspaceById(id: string): Promise<Customer | null> {
    return this.customerPrismaAdapter.findWorkspaceById(id);
  }

  /**
   * Finds all workspaces available
   * @returns workspaces
   */
  async findAll() {
    return this.customerPrismaAdapter.findAll();
  }

  /**
   * Finds the customer settings of a workspace by the workspace ID
   * @param customerId workspace ID
   * @returns CustomerSettings prisma entry
   */
  getCustomerSettingsByCustomerId(customerId: string): Promise<CustomerSettings | null> {
    return this.customerPrismaAdapter.getCustomerSettingsByCustomerId(customerId);
  }

  /**
   * Finds a workspace by one of the provided identifiers.
   * @param slugs the identifiers. These could include either IDs or slugs
   * @returns A workspace matching either an provided ID or slug
   */
  findWorkspaceBySlugs(slugs: (string | undefined)[]) {
    return this.customerPrismaAdapter.findWorkspaceBySlugs(slugs);
  }

  /**
   * Deletes a workspace from the database
   * @param customerId 
   * @returns the deleted workspace
   */
  async delete(customerId: string): Promise<Customer> {
    return this.customerPrismaAdapter.delete(customerId);
  }

  /**
   * Creates a new dialogue (using a template) and optionally populates the dialogue with fake data
   * @param customer A Customer prisma entry
   * @param template A dialogue template
   * @param willGenerateFakeData A boolean indicating whether fake data should be generated
   */
  seedByTemplate = async (customer: Customer, template: WorkspaceTemplate = defaultWorkspaceTemplate, willGenerateFakeData: boolean = false) => {
    // Step 1: Make dialogue
    const dialogueInput: CreateDialogueInput = { slug: template.slug, title: template.title, description: template.description, customer: { id: customer.id, create: false } };
    const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

    if (!dialogue) throw 'ERROR: No dialogue created!'
    // Step 2: Make the leafs
    const leafs = await this.nodeService.createTemplateLeafNodes(template.leafNodes, dialogue.id);

    // Step 3: Make nodes
    await this.nodeService.createTemplateNodes(dialogue.id, customer.name, leafs);

    // Step 4: possibly
    if (willGenerateFakeData) {
      await this.dialogueService.generateFakeData(dialogue.id, template);
    }
  };

  /**
   * Edits a workspace
   * @param input the new workspace settings
   * @returns Updated workspace
   */
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

  /**
   * Creates a new workspace
   * @param input workspace properties
   * @param createdUserId the user ID creating the new workspace
   * @returns A newly created workspace
   */
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

  /**
   * Deletes a workspace
   * @param customerId ID of workspace to be deleted
   * @returns deleted workspace
   */
  async deleteWorkspace(customerId: string) {
    if (!customerId) return null;

    const customer = await this.customerPrismaAdapter.findWorkspaceById(customerId);

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
