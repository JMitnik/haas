import { Customer, PrismaClient, CustomerSettings, DialogueImpactScore, DialogueStatisticsSummaryCache, ChoiceNodeEntry, NodeEntry, Session } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';

import { NexusGenInputs } from '../../generated/nexus';
import DialogueService from '../questionnaire/DialogueService';
import NodeService from '../QuestionNode/NodeService';
import defaultWorkspaceTemplate, { defaultMassSeedTemplate, WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import prisma from '../../config/prisma';
import { CustomerPrismaAdapter } from './CustomerPrismaAdapter';
import TagPrismaAdapter from '../tag/TagPrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import UserOfCustomerPrismaAdapter from '../users/UserOfCustomerPrismaAdapter';
import { CreateDialogueInput } from '../questionnaire/DialoguePrismaAdapterType';
import { groupBy, maxBy, meanBy, uniq } from 'lodash';
import cuid from 'cuid';
import { addDays, differenceInHours, isEqual, subDays } from 'date-fns';
import DialogueStatisticsService from '../questionnaire/DialogueStatisticsService';
import NodeEntryService from '../node-entry/NodeEntryService';
import { isPresent } from 'ts-is-present';

class CustomerService {
  customerPrismaAdapter: CustomerPrismaAdapter;
  tagPrismaAdapter: TagPrismaAdapter;
  dialogueService: DialogueService;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;
  nodeService: NodeService;
  dialogueStatisticsService: DialogueStatisticsService;
  nodeEntryService: NodeEntryService;

  constructor(prismaClient: PrismaClient) {
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.dialogueService = new DialogueService(prismaClient);
    this.dialogueStatisticsService = new DialogueStatisticsService(prismaClient);
    this.tagPrismaAdapter = new TagPrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.nodeEntryService = new NodeEntryService(prismaClient);
  }

  findNestedMostChangedPath = async (
    customerId: string,
    impactScoreType: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime as Date, 7) : endDateTime;

    // This week/month/24hr should be set through front-end but for now hardcoded 7 days
    const prevStartDateTime = subDays(startDateTime as Date, 7);

    const sessions = await this.customerPrismaAdapter.findChoiceNodeSessionsWithinDates(
      customerId,
      prevStartDateTime,
      endDateTimeSet,
    );

    const splittedSessions = sessions.reduce(
      (previousValue, session) => {
        const deepest = maxBy(session.nodeEntries, (entry) => entry.depth);
        const item = {
          sessionId: session.id,
          dialogueId: session.dialogueId,
          mainScore: session.mainScore,
          entry: deepest,
          prev: true,
        };
        if (session.createdAt < startDateTime) {
          previousValue.prevData.push(item);
          return previousValue;
        } else {
          item.prev = false;
          previousValue.currData.push(item);
          return previousValue;
        }
      }, {
      prevData: [] as ({
        sessionId: string;
        dialogueId: string;
        mainScore: number;
        entry: (NodeEntry & {
          choiceNodeEntry: ChoiceNodeEntry | null;
        }) | undefined;
        prev: boolean;
      })[], currData: [] as ({
        sessionId: string;
        dialogueId: string;
        mainScore: number;
        entry: (NodeEntry & {
          choiceNodeEntry: ChoiceNodeEntry | null;
        }) | undefined;
        prev: boolean;
      })[],
    });

    const prevDataGroupedOptions = groupBy(splittedSessions.prevData, (session) => {
      return `${session.dialogueId}_${session.entry?.choiceNodeEntry?.value}`;
    });

    const currDataGroupedOptions = groupBy(splittedSessions.currData, (session) => {
      return `${session.dialogueId}_${session.entry?.choiceNodeEntry?.value}`;
    });

    const uniqueKeys = uniq([...Object.keys(prevDataGroupedOptions), ...Object.keys(currDataGroupedOptions)])

    const optionDeltas = uniqueKeys.map((key) => {
      const optionSessionArray = currDataGroupedOptions[key];
      const optionPrevSessionArray = prevDataGroupedOptions[key];

      // If doesn't exist in one of the two dictionaries => cannot calculate average nor delta
      if (!currDataGroupedOptions[key] || !prevDataGroupedOptions[key]) {
        return undefined;
      }

      const averageCurr = meanBy(optionSessionArray, (entry) => entry.mainScore);
      const averagePrev = meanBy(optionPrevSessionArray, (entry) => entry.mainScore);
      const delta = Math.max(averageCurr, averagePrev) - Math.min(averageCurr, averagePrev);
      const percentageChange = ((averageCurr - averagePrev) / averagePrev) * 100;

      const dialogueId = key.split('_')?.[0] || '';

      return { option: key, averageCurr, averagePrev, delta, percentageChange, dialogueId: dialogueId };
    }).filter(isPresent);

    const mostChanged = maxBy(optionDeltas, (optionDelta) => {
      if (!optionDelta?.percentageChange) return 0;
      return Math.sign(optionDelta.percentageChange) === -1
        ? -1 * optionDelta.percentageChange
        : optionDelta.percentageChange;
    });

    console.log('Most changed: ', mostChanged);

    const dialogue = await this.dialogueService.getDialogueById(mostChanged?.dialogueId as string);

    const group = dialogue?.title || 'No Dialogue found';
    const path: string[] = [mostChanged?.option as string];

    return { group, path, percentageChanged: mostChanged?.percentageChange || 0 };


  }

  findNestedMostPopularPath = async (
    customerId: string,
    impactScoreType: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime as Date, 7) : endDateTime;

    const sessions = await this.customerPrismaAdapter.findChoiceNodeSessionsWithinDates(
      customerId,
      startDateTime,
      endDateTimeSet,
    );

    const sessionWithDeepestEntry = sessions.map((session) => {
      const deepest = maxBy(session.nodeEntries, (entry) => entry.depth);
      return {
        sessionId: session.id,
        dialogueId: session.dialogueId,
        mainScore: session.mainScore,
        entry: deepest,
      };
    });

    const groupedDeepEntrySessions = groupBy(sessionWithDeepestEntry, (session) => {
      return `${session.dialogueId}_${session.entry?.choiceNodeEntry?.value}`;
    });

    const mostPrevalent = maxBy(Object.entries(groupedDeepEntrySessions), (entry) => {
      return entry[1].length;
    })

    const averageScore = meanBy(mostPrevalent?.[1], (entry) => entry.mainScore);
    const nrVotes = mostPrevalent?.[1].length;
    const dialogueNodeEntryValue = mostPrevalent?.[0]?.split('_');
    const dialogueId = dialogueNodeEntryValue?.[0] as string;

    const dialogue = await this.dialogueService.getDialogueById(dialogueId);

    const path: string[] = [dialogueNodeEntryValue?.[1] as string]
    const group = dialogue?.title || 'No group found';

    return { group, path, nrVotes: nrVotes || 0, impactScore: averageScore || 0 };
  };

  findNestedDialogueStatisticsSummary = async (
    customerId: string,
    impactScoreType: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const dialogueIds = await this.dialogueService.findDialogueIdsByCustomerId(customerId);
    const endDateTimeSet = !endDateTime ? addDays(startDateTime as Date, 7) : endDateTime;

    const cachedSummaries: DialogueStatisticsSummaryCache[] = [];
    const caches = await this.dialogueStatisticsService.dialoguePrismaAdapter
      .findDialogueStatisticsSummaries(
        dialogueIds,
        startDateTime as Date,
        endDateTimeSet,
        impactScoreType
      )

    if (!refresh) {
      caches.forEach((cache) => {
        if (differenceInHours(Date.now(), cache.updatedAt) == 0) {
          dialogueIds.splice(dialogueIds.indexOf(cache.dialogueId), 1);
          return cachedSummaries.push(cache);
        };
      });
    }

    if (caches.length === cachedSummaries.length && dialogueIds.length === 0) {
      return caches;
    }

    const nodeEntries = await this.nodeEntryService.findDialogueStatisticsRootEntries(
      dialogueIds,
      startDateTime as Date,
      endDateTimeSet,
    );

    // Group node entries by their dialogue ids so we can calculate impact score
    const sessionContext = groupBy(nodeEntries, (nodeEntry) => nodeEntry.session?.dialogueId);

    // If no node entries/sessions exist for a dialogue return empty list so cache entry can still get created
    dialogueIds.forEach((dialogueId) => {
      if (!sessionContext[dialogueId]) {
        sessionContext[dialogueId] = [];
      }
    });

    const newCaches: DialogueStatisticsSummaryCache[] = [];

    // For every dialogue, calculate impact score and upsert a cache entry 
    Object.entries(sessionContext).forEach((context) => {
      const dialogueId = context[0];
      const nodeEntries = context[1];
      const impactScore = this.dialogueStatisticsService.calculateNodeEntriesImpactScore(
        impactScoreType,
        nodeEntries
      );

      // Since we have a unique key based on dialogue id, impact score type, start/end date
      // We can find a unique cache id based on these variables if there is already entry
      const cacheId = caches.find((cache) => {
        return cache.dialogueId === dialogueId &&
          cache.impactScoreType === impactScoreType &&
          isEqual(cache.startDateTime as Date, startDateTime) &&
          isEqual(cache.endDateTime as Date, endDateTimeSet)
      })?.id;

      const res: DialogueStatisticsSummaryCache = {
        id: cacheId || '-1',
        dialogueId,
        updatedAt: new Date(Date.now()),
        impactScore: impactScore || 0,
        impactScoreType: impactScoreType,
        nrVotes: nodeEntries.length || 0,
        startDateTime: startDateTime,
        endDateTime: endDateTimeSet,
      }

      newCaches.push(res);

      // Turn promise in a void to increase performance
      // There is no need to wait for the updated data from DB because you already have the data you need
      void this.dialogueService.upsertDialogueStatisticsSummary(
        res.id,
        {
          dialogueId: res.dialogueId,
          impactScore: res.impactScore || 0,
          nrVotes: res.nrVotes || 0,
          impactScoreType: res.impactScoreType,
          startDateTime: res.startDateTime as Date,
          endDateTime: res.endDateTime as Date,
        }
      );

    });

    return [...cachedSummaries, ...newCaches];
  }

  massSeed = async (input: NexusGenInputs['MassSeedInput'], isStrict: boolean = false) => {
    const { customerId, maxGroups, maxSessions, maxTeams } = input;

    const customer = await this.findWorkspaceById(customerId);
    if (!customer) return null;

    // Generate 
    const amtGroups = !isStrict ? Math.ceil(Math.random() * maxGroups + 1) : maxGroups;
    const maleDialogueNames = [...Array(amtGroups)].flatMap((number, index) => {
      const teamAge = 8 + (4 * index);
      const groupName = `Group U${teamAge}`;
      const amtTeams = !isStrict ? Math.floor(Math.random() * maxTeams + 1) : maxTeams;
      const teamNames = [...Array(amtTeams)].map((number, index) => `${groupName} Male - Team ${index + 1}`);
      return teamNames;
    });

    const femaleDialogueNames = [...Array(amtGroups)].flatMap((number, index) => {
      const teamAge = 8 + (4 * index);
      const groupName = `Group U${teamAge}`;
      const amtTeams = !isStrict ? Math.floor(Math.random() * maxTeams + 1) : maxTeams;
      const teamNames = [...Array(amtTeams)].map((number, index) => `${groupName} Female - Team ${index + 1}`);
      return teamNames;
    });

    const dialogueNames = [...maleDialogueNames, ...femaleDialogueNames];

    await Promise.all(dialogueNames.map(async (dialogueName, index) => {
      defaultMassSeedTemplate.title = dialogueName;
      const slug = cuid();
      defaultMassSeedTemplate.slug = slug;
      const dialogueInput: CreateDialogueInput = {
        slug,
        title: dialogueName,
        description: defaultMassSeedTemplate.description,
        customer: { id: customer.id, create: false },
      };

      const dialogue = await this.dialoguePrismaAdapter.createTemplate(dialogueInput);

      if (!dialogue) throw 'ERROR: No dialogue created!'
      // Step 2: Make the leafs
      const leafs = await this.nodeService.createTemplateLeafNodes(defaultMassSeedTemplate.leafNodes, dialogue.id);

      // Step 3: Make nodes
      await this.nodeService.createTemplateNodes(dialogue.id, customer.name, leafs);

      await this.dialogueService.massGenerateFakeData(dialogue.id, defaultMassSeedTemplate, maxSessions, isStrict);
    }));

    return customer;
  }

  /**
   * Get a dialogue based on workspace ID and dialogue Slug.
   * @param customerId Workspace ID
   * @param dialogueSlug Dialogue Slug
   * @returns A dialogue including question Ids and edges
   */
  async getDialogue(customerId: string, dialogueSlug: string) {
    const customer = await prisma.customer.findUnique({
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
    const customer = await this.customerPrismaAdapter.updateCustomer(input.id, {
      name: input.name,
      slug: input.slug,
      logoOpacity: input.logoOpacity,
      logoUrl: input.logo,
      primaryColour: input.primaryColour,
    });

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
      // @ts-ignore
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
