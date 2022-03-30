import { addDays, differenceInHours, subDays } from 'date-fns';
import _, { groupBy, meanBy, sample, uniq, uniqBy } from 'lodash';
import cuid from 'cuid';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { isPresent } from 'ts-is-present';
import { Prisma, Dialogue, LanguageEnum, NodeType, PostLeafNode, Tag, PrismaClient, Edge, NodeEntry, SliderNodeEntry, ChoiceNodeEntry, QuestionOption, DialogueImpactScore, DialogueTopicCache, QuestionNode } from '@prisma/client';

import NodeService from '../QuestionNode/NodeService';
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import {
  HistoryDataProps, HistoryDataWithEntry, IdMapProps,
  PathFrequency, QuestionProps, StatisticsProps, CopyDialogueInputType, ChildNodeEntry, TopicNodeEntry, TopicSession,
} from './DialogueTypes';
import NodeEntryService from '../node-entry/NodeEntryService';
import SessionService from '../session/SessionService';
import defaultWorkspaceTemplate, { MassSeedTemplate, rootTopics, WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import DialoguePrismaAdapter from './DialoguePrismaAdapter';
import { CreateQuestionsInput } from './DialoguePrismaAdapterType';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import SessionPrismaAdapter from '../session/SessionPrismaAdapter';
import NodeEntryPrismaAdapter from '../node-entry/NodeEntryPrismaAdapter';
import EdgePrismaAdapter from '../edge/EdgePrismaAdapter';
import QuestionNodePrismaAdapter from '../QuestionNode/QuestionNodePrismaAdapter';
import EdgeService from '../edge/EdgeService';


function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

class DialogueService {
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;
  sessionPrismaAdapter: SessionPrismaAdapter;
  nodeEntryPrismaAdapter: NodeEntryPrismaAdapter;
  edgePrismaAdapter: EdgePrismaAdapter;
  edgeService: EdgeService;
  questionNodePrismaAdapter: QuestionNodePrismaAdapter;
  nodeService: NodeService;

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.nodeEntryPrismaAdapter = new NodeEntryPrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.edgePrismaAdapter = new EdgePrismaAdapter(prismaClient);
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
  }

  calculateSessionTopicImpactScores = (
    type: DialogueImpactScore,
    groupedNodeEntries: _.Dictionary<{
      mainScore: number;
      id: string;
      choiceNodeEntry: ChoiceNodeEntry | null;
    }[]>) => {
    switch (type) {

      case DialogueImpactScore.AVERAGE:
        const subTopicScores = Object.entries(groupedNodeEntries).map((entry) => {
          const option = entry[0];
          const average = meanBy(entry[1], (data) => data?.mainScore);
          return { name: option, impactScore: average, nrVotes: entry[1].length };
        });
        return subTopicScores;

      default:
        return [];

    };
  };

  /**
   * Calculates an impact score for all provided topics based on impact type
   * @param type DialogueImpactType
   * @param groupedSessions A dictionary where key = topic and value = data of topic
   * @returns a list of impact scores for every topic
   */
  calculateTopicImpactScores = (
    type: DialogueImpactScore,
    groupedSessions: _.Dictionary<{
      id: string;
      session: {
        mainScore: number;
      } | null;
      choiceNodeEntry: {
        value: string | null;
      } | null;
    }[]>) => {
    switch (type) {

      case DialogueImpactScore.AVERAGE:
        const subTopicScores = Object.entries(groupedSessions).map((entry) => {
          const option = entry[0];
          const average = meanBy(entry[1], (data) => data?.session?.mainScore);
          return { name: option, impactScore: average, nrVotes: entry[1].length };
        });
        return subTopicScores;

      default:
        return [];

    };
  };

  completementSessionTopics = (
    calculatedTopics: {
      name: string;
      impactScore: number;
      nrVotes: number;
    }[],
    rootOptions: { value: string }[],
  ) => {
    const allPotentialSubTopics = rootOptions.map((option) => option.value)

    // Add sub topics which don't have any node entries to complement list with rest of sub topics
    allPotentialSubTopics.forEach((option) => {
      const targetSubTopic = calculatedTopics.find((subTopic) => subTopic.name === option);
      if (!targetSubTopic) calculatedTopics.push({ nrVotes: 0, impactScore: 0, name: option });
    });

    return calculatedTopics;
  }

  /**
   * Finds all the potential sub topics available for a topic and creates an placeholder entry for the missing ones
   * @param targetNodeEntries a list of node entries with their child node entries
   * @param calculatedTopics a list of topics with their impactScore
   * @returns a complemented list of topics with their impact score
   */
  completementTopics = (
    targetNodeEntries: TopicNodeEntry[],
    calculatedTopics: {
      name: string;
      impactScore: number;
      nrVotes: number;
    }[],
    rootOptions?: { value: string }[],
  ) => {
    let allPotentialSubTopics;

    if (rootOptions) {
      allPotentialSubTopics = rootOptions.map((option) => option.value);
    } else {
      // Get all child nodes
      const childNodes = targetNodeEntries.flatMap(
        (targetNodeEntry) => targetNodeEntry?.nodeEntry?.relatedNode?.children
      ).filter(isPresent);

      // All unique sub topics available within the childNodes
      allPotentialSubTopics = uniq(childNodes?.flatMap(
        (child) => child.childNode?.options.length ? child.childNode?.options.map((option) => option.value) : undefined)
      ).filter(isPresent);
    }

    // Add sub topics which don't have any node entries to complement list with rest of sub topics
    allPotentialSubTopics.forEach((option) => {
      const targetSubTopic = calculatedTopics.find((subTopic) => subTopic.name === option);
      if (!targetSubTopic) calculatedTopics.push({ nrVotes: 0, impactScore: 0, name: option });
    });

    return calculatedTopics;
  }

  findSubTopicsOfSessions = async (
    topicSessions: TopicSession[],
    dialogueId: string,
    impactScoreType: DialogueImpactScore,
    rootQuestion: {
      id: string;
      options: { id: number; value: string }[];
    },
  ): Promise<{
    name: string;
    impactScore: number;
    nrVotes: number;
  }[]> => {
    if (rootQuestion && topicSessions.length === 0) {
      return rootQuestion.options.map((option) => ({ nrVotes: 0, impactScore: 0, name: option.value }));
    }

    const nodeEntries = topicSessions.flatMap((session) => session.nodeEntries.map(
      (nodeEntry) => ({ ...nodeEntry, mainScore: session.mainScore })));

    const groupedNodeEntries = groupBy(nodeEntries,
      (nodeEntry) => nodeEntry?.choiceNodeEntry?.value
    );

    const subTopicScores = this.calculateSessionTopicImpactScores(impactScoreType, groupedNodeEntries);

    const complementedSubTopic = this.completementSessionTopics(subTopicScores, rootQuestion.options);
    return complementedSubTopic;
  }

  /**
   * Calculates impact scores for a list of subtopics
   * @param targetNodeEntries a list of node entries with their child node entries
   * @returns an impact score for every sub topic
   */
  findSubTopicsOfNodeEntries = async (
    targetNodeEntries: TopicNodeEntry[],
    dialogueId: string,
    impactScoreType: DialogueImpactScore,
    topic?: string,
    rootQuestion?: {
      id: string;
      options: { id: number; value: string }[];
    },
  ) => {
    if (!topic && rootQuestion && targetNodeEntries.length === 0) {
      return rootQuestion.options.map((option) => ({ nrVotes: 0, impactScore: 0, name: option.value }));
    }

    // If no nodeEntries are found we need to find the sub topics through edge condition string comparison
    if (topic && targetNodeEntries.length === 0) {
      // TODO: Replace with rootQuestion.options maybe? (Still needs to be fetched for subTopic option)
      return this.edgeService.findChildOptionsByEdgeCondition(dialogueId, topic);
    }

    // Map all node entries connected to the the children of our node entry
    const childRelatedNodeEntries = targetNodeEntries.flatMap(
      (targetNodeEntry) => targetNodeEntry?.nodeEntry?.relatedNode?.children.flatMap(
        (child) => child.isRelatedNodeOfNodeEntries || undefined,
      )).filter(isPresent);

    // Make sure there are no double node entries that could influence the impactScore
    const uniqueNodeEntries = uniqBy(childRelatedNodeEntries, (nodeEntry) => nodeEntry.id);
    const groupedSessions = groupBy(uniqueNodeEntries, (nodeEntry) => nodeEntry.choiceNodeEntry?.value);

    const subTopicScores = this.calculateTopicImpactScores(impactScoreType, groupedSessions);

    // In case an answer has never been given, it wont be possible to find the sub topic in one of the node entries
    // The next code finds all the potential sub topics available and creates an entry for the missing ones
    const complementedSubTopic = this.completementTopics(targetNodeEntries, subTopicScores, rootQuestion?.options);

    return complementedSubTopic;
  }

  /**
   * Merges new scores with existing sub topics
   * @param scores 
   * @param subTopics 
   * @returns updated sub topic 
   */
  mergeScoresWithTopicIds = (
    scores: {
      nrVotes: number;
      impactScore: number;
      name: string;
    }[],
    subTopics: { id: string; name: string }[]
  ) => {
    const merged = _.merge(_.keyBy(subTopics, 'name'), _.keyBy(scores, 'name'));
    return _.values(merged);
  }

  /**
   * Finds all unique sub topics of the root question and calculate their impact scores
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @returns an impact score for every sub topic
   */
  findSubTopicsOfRoot = async (
    dialogueId: string,
    impactScoreType: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;

    // TODO: At the moment only slider node but maybe in future different type of node as root
    const rootNode = await this.nodeService.findSliderNode(dialogueId);

    if (!rootNode?.id) return { name: '', nrVotes: 0, impactScore: 0, subTopics: [] };

    const prevStatistics = await this.dialoguePrismaAdapter.findDialogueTopicStatistics(
      startDateTime,
      endDateTimeSet,
      '',
      dialogueId,
      impactScoreType,
    );

    // Only if more than hour difference between last cache entry and now should we update cache
    if (prevStatistics) {
      if (differenceInHours(Date.now(), prevStatistics.updatedAt) == 0
        && !refresh
        && prevStatistics.subTopics.length > 0) {
        return prevStatistics;
      }
    }

    const sessions = await this.nodeEntryPrismaAdapter.findNodeEntriesByQuestionId(
      rootNode.id,
      startDateTime,
      endDateTimeSet
    );

    const topicNrVotes = sessions.length;
    const topicImpactScore = meanBy(
      sessions,
      (session) => session.mainScore, //choiceNodeEntry.nodeEntry.session?.mainScore
    );
    const topicName = '';

    const subTopicScores = await this.findSubTopicsOfSessions(
      sessions, dialogueId, impactScoreType, rootNode
    );

    const mergedSubTopics = this.mergeScoresWithTopicIds(subTopicScores, prevStatistics?.subTopics || []);

    void this.dialoguePrismaAdapter.upsertDialogueTopicStatistics({
      dialogueId,
      endDateTime: endDateTimeSet,
      startDateTime,
      impactScore: topicImpactScore || 0,
      impactScoreType,
      name: topicName,
      nrVotes: topicNrVotes,
      id: prevStatistics?.id,
      subTopics: mergedSubTopics,
    });

    return {
      impactScore: topicImpactScore || 0,
      name: topicName,
      nrVotes: topicNrVotes,
      subTopics: mergedSubTopics,
    };
  };

  /**
   * Finds all unique sub topics of a topic and calculate their impact scores
   * @param dialogueId 
   * @param topic 
   * @param startDateTime 
   * @param endDateTime 
   * @returns an impact score for every sub topic
   */
  findSubTopicsByTopic = async (
    dialogueId: string,
    impactScoreType: DialogueImpactScore,
    topic: string,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;

    const prevStatistics = await this.dialoguePrismaAdapter.findDialogueTopicStatistics(
      startDateTime,
      endDateTimeSet,
      topic,
      dialogueId,
      impactScoreType,
    );


    // Only if more than hour difference between last cache entry and now should we update cache 
    // AND if there is already subtopics found 
    // AND if refresh is set to false
    if (prevStatistics) {
      if (differenceInHours(Date.now(), prevStatistics.updatedAt) == 0
        && prevStatistics.subTopics.length > 0
        && !refresh) {
        return prevStatistics;
      }
    }

    const targetNodeEntries = await this.nodeEntryPrismaAdapter.findNodeEntriesByTopic(
      dialogueId,
      topic,
      startDateTime,
      endDateTimeSet
    );

    const topicNrVotes = targetNodeEntries.length;
    const topicImpactScore = meanBy(
      targetNodeEntries,
      (choiceNodeEntry) => choiceNodeEntry.nodeEntry.session?.mainScore
    );
    const topicName = topic;

    const subTopicScores = await this.findSubTopicsOfNodeEntries(targetNodeEntries, dialogueId, impactScoreType, topic);
    const mergedSubTopics = this.mergeScoresWithTopicIds(subTopicScores, prevStatistics?.subTopics || []);

    const topicCache = await this.dialoguePrismaAdapter.upsertDialogueTopicStatistics({
      dialogueId,
      endDateTime: endDateTimeSet,
      startDateTime,
      impactScore: topicImpactScore || 0,
      impactScoreType,
      name: topicName,
      nrVotes: topicNrVotes,
      id: prevStatistics?.id,
      subTopics: mergedSubTopics,
    })

    return { ...topicCache, subTopics: topicCache.subTopics };
  };

  updateTags(dialogueId: string, entries?: string[] | null | undefined): Promise<Dialogue> {
    const tags = entries?.map((entryId) => ({ id: entryId })) || [];

    return this.dialoguePrismaAdapter.connectTags(dialogueId, tags);
  };

  async getFilteredDialogues(searchTerm?: string | null | undefined) {
    let dialogues = await this.dialoguePrismaAdapter.getAllDialoguesWithTags();

    if (searchTerm) {
      dialogues = DialogueService.filterDialoguesBySearchTerm(dialogues, searchTerm);
    }

    return dialogues;
  };

  getDialogueById(dialogueId: string): Promise<Dialogue | null> {
    return this.dialoguePrismaAdapter.getDialogueById(dialogueId);
  };

  async getCTAsByDialogueId(dialogueId: string, searchTerm?: string | null | undefined) {
    const leafs = await this.dialoguePrismaAdapter.getCTAsByDialogueId(dialogueId);

    if (searchTerm) {
      const lowerCasedSearch = searchTerm.toLowerCase();
      return leafs.filter((leaf) => leaf.title.toLowerCase().includes(lowerCasedSearch));
    };

    return leafs;
  };

  getCampaignVariantsByDialogueId(dialogueId: string) {
    return this.dialoguePrismaAdapter.getCampaignVariantsByDialogueId(dialogueId);
  }

  getQuestionsByDialogueId(dialogueId: string) {
    return this.dialoguePrismaAdapter.getQuestionsByDialogueId(dialogueId);
  };

  getEdgesByDialogueId(dialogueId: string): Promise<Edge[]> {
    return this.dialoguePrismaAdapter.getEdgesByDialogueId(dialogueId);
  };

  getRootQuestionByDialogueId(dialogueId: string) {
    return this.dialoguePrismaAdapter.getRootQuestionByDialogueId(dialogueId);
  };

  getTagsByDialogueId(dialogueId: string) {
    return this.dialoguePrismaAdapter.getTagsByDialogueId(dialogueId);
  };

  findDialoguesByCustomerId(customerId: string) {
    return this.dialoguePrismaAdapter.findDialoguesByCustomerId(customerId);
  };

  async delete(dialogueId: string) {
    return this.dialoguePrismaAdapter.delete(dialogueId);
  };

  async findDialogueIdsByCustomerId(customerId: string) {
    const dialogueIdObjects = await this.dialoguePrismaAdapter.findDialogueIdsOfCustomer(customerId);
    const dialogueIds = dialogueIdObjects.map((dialogue) => dialogue.id);

    return dialogueIds;
  };

  static constructDialogue(
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{ id: string }> = [],
    language: LanguageEnum,
  ): Prisma.DialogueCreateInput {
    const constructDialogueFragment = {
      customer: { connect: { id: customerId } },
      title,
      language,
      slug: dialogueSlug,
      description,
      publicTitle,
      questions: { create: [] },
      tags: {},
    };

    if (tags.length) {
      constructDialogueFragment.tags = { connect: tags.map((tag) => ({ id: tag.id })) };
    };

    return constructDialogueFragment;
  };

  static filterDialoguesBySearchTerm = (dialogues: Array<Dialogue & {
    tags: Tag[];
  }>, searchTerm: string) => dialogues.filter((dialogue) => {
    if (dialogue.title.toLowerCase().includes(
      searchTerm.toLowerCase(),
    )) { return true; };

    if (dialogue.publicTitle?.toLowerCase().includes(
      searchTerm.toLowerCase()
    )) { return true; };

    if (dialogue.tags.find((tag) => tag.name.toLowerCase().includes(
      searchTerm.toLowerCase(),
    ))) { return true; };

    return false;
  });

  static updateTags = (
    dbTags: Array<Tag>,
    newTags: Array<string>,
    updateDialogueArgs: Prisma.DialogueUpdateInput,
  ) => {
    const newTagObjects = newTags.map((tag) => ({ id: tag }));

    const deleteTagObjects: Prisma.TagWhereUniqueInput[] = [];
    dbTags.forEach((tag) => {
      if (!newTags.includes(tag.id)) {
        deleteTagObjects.push({ id: tag.id });
      }
    });

    const tagUpdateArgs: any = {};
    if (newTagObjects.length > 0) {
      tagUpdateArgs.connect = newTagObjects;
    };

    if (deleteTagObjects.length > 0) {
      tagUpdateArgs.disconnect = deleteTagObjects;
    };

    updateDialogueArgs.tags = tagUpdateArgs;

    return updateDialogueArgs;
  };

  static updatePostLeafNode(
    dbPostLeaf: PostLeafNode | null | undefined,
    heading: string | null | undefined,
    subHeading: string | null | undefined,
  ): Prisma.PostLeafNodeUpdateOneWithoutDialogueInput | undefined {
    if (!dbPostLeaf && !heading && !subHeading) {
      return undefined;
    } else if (dbPostLeaf && !heading && !subHeading) {
      return { disconnect: true };
    } else if (dbPostLeaf && (heading || subHeading)) {
      return {
        update: {
          header: heading || '',
          subtext: subHeading || '',
        },
      };
    } else if (!dbPostLeaf && (heading || subHeading)) {
      return {
        create: {
          header: heading || '',
          subtext: subHeading || '',
        },
      };
    }

    return undefined;
  }

  editDialogue = async (args: any) => {
    const {
      customerSlug,
      dialogueSlug,
      title,
      description,
      publicTitle,
      tags,
      isWithoutGenData,
      dialogueFinisherHeading,
      dialogueFinisherSubheading,
      language,
    } = args;

    const dbDialogue = await this.customerPrismaAdapter.getDialogueTags(customerSlug, dialogueSlug);

    const postLeafNode = DialogueService.updatePostLeafNode(
      dbDialogue?.postLeafNode,
      dialogueFinisherHeading,
      dialogueFinisherSubheading
    );

    let updateDialogueArgs: Prisma.DialogueUpdateInput = {
      title, description, publicTitle, isWithoutGenData, postLeafNode, language,
    };
    if (dbDialogue?.tags) {
      updateDialogueArgs = DialogueService.updateTags(dbDialogue.tags, tags.entries, updateDialogueArgs);
    };

    return this.dialoguePrismaAdapter.update(dbDialogue?.id || '-1', updateDialogueArgs);
  };

  /**
   * Get top popular N paths based on occurence frequency.
   * @param entries
   * @param nPaths
   */
  static getTopNPaths = (entries: HistoryDataWithEntry[], nPaths: number = 3, basicSentiment: string) => {
    const entryWithText = entries.map((entry) => ({
      textValue: NodeEntryService.getTextValueFromEntry(entry),
      ...entry,
    })).filter((entry) => entry.textValue);

    const countedPaths = _.countBy(entryWithText, 'textValue');

    // Built in cleanup
    Object.keys(countedPaths).forEach((path) => path === 'undefined' && delete countedPaths[path]);

    const countTuples = _.sortBy(_.toPairs(countedPaths), 1).reverse();
    const pathFrequencies: PathFrequency[] = countTuples.map(([answer, quantity]) => ({
      answer,
      quantity,
      basicSentiment,
    }));

    // If there are three, grab the first three, otherwise get the entire element
    const topNPaths = pathFrequencies.length > nPaths ? pathFrequencies.slice(0, nPaths) : pathFrequencies;

    return topNPaths || [];
  };

  static getNextLineData = async (
    dialogueId: string,
    numberOfDaysBack: number,
    limit: number,
    offset: number,
  ): Promise<Array<NexusGenRootTypes['lineChartDataType']>> => {
    const startDate = subDays(new Date(), numberOfDaysBack);
    const sessions = await SessionService.fetchSessionsByDialogue(dialogueId, { limit, offset, startDate });

    if (!sessions) {
      return [];
    }

    const scoreEntries = await SessionService.getScoringEntriesFromSessions(sessions);

    // Then dresses it up as X/Y data for the lineChart
    const values = scoreEntries?.map((entry) => ({
      x: entry?.creationDate.toUTCString(),
      y: entry?.sliderNodeEntry?.value,
      nodeEntryId: entry?.id,
    }));

    return values;
  };

  massGenerateFakeData = async (dialogueId: string, template: MassSeedTemplate, maxSessions: number = 30) => {
    const currentDate = new Date();

    const nrDaysBack = Array.from(Array(30)).map((empty, index) => index + 1);
    const datesBackInTime = nrDaysBack.map((amtDaysBack) => subDays(currentDate, amtDaysBack));
    const dialogueWithNodes = await this.dialoguePrismaAdapter.getDialogueWithNodesAndEdges(dialogueId);
    await this.dialoguePrismaAdapter.setGeneratedWithGenData(dialogueId, true);

    const rootNode = dialogueWithNodes?.questions.find((node) => node.isRoot);
    const edgesOfRootNode = dialogueWithNodes?.edges.filter((edge) => edge.parentNodeId === rootNode?.id);

    // Stop if no rootnode
    if (!rootNode) return;

    // For every particular date, generate a fake score
    await Promise.all(datesBackInTime.map(async (backDate) => {
      await Promise.all([...Array(Math.ceil(Math.random() * maxSessions + 1))].map(async () => {
        const simulatedRootVote: number = getRandomInt(100);

        const simulatedChoice = Object.keys(template.topics)[
          Math.floor(Math.random() * Object.keys(template.topics).length)
        ].toString();
        const subChoices = Object.entries(template.topics).find((data) => data[0] === simulatedChoice)?.[1] as string[]
        const simulatedSubChoice = sample(subChoices) as string;
        const simulatedChoiceEdge = edgesOfRootNode?.find((edge) => edge.conditions.every((condition) => {
          if ((!condition.renderMin && !(condition.renderMin === 0)) || !condition.renderMax) return false;
          const isValid = condition?.renderMin < simulatedRootVote && condition?.renderMax > simulatedRootVote;

          return isValid;
        }));

        const edgeOfSubChoice = dialogueWithNodes?.edges.find(
          (edge) => edge.parentNodeId === simulatedChoiceEdge?.childNodeId
            && edge.conditions.some((condition) => condition.matchValue === simulatedChoice));

        const simulatedChoiceNodeId = simulatedChoiceEdge?.childNode.id;
        const simulatedSubChoiceNode = simulatedChoiceEdge?.childNode.children.find(
          (child) => child.childNode.options.find(
            (option) => option.value === simulatedSubChoice))?.childNode
        const simulatedSubChoiceNodeId = simulatedSubChoiceNode?.id;

        if (!simulatedChoiceNodeId) return;

        const fakeSessionInputArgs: (
          {
            createdAt: Date;
            dialogueId: string;
            rootNodeId: string;
            simulatedRootVote: number;
            simulatedChoiceNodeId: string;
            simulatedChoiceEdgeId?: string;
            simulatedChoice: string;
            simulatedSubChoiceNodeId: string;
            simulatedSubChoiceEdgeId?: string;
            simulatedSubChoice: string;
          }) = {
          dialogueId,
          createdAt: backDate,
          rootNodeId: rootNode.id,
          simulatedRootVote,
          simulatedChoiceNodeId,
          simulatedChoiceEdgeId: simulatedChoiceEdge?.id,
          simulatedChoice,
          simulatedSubChoiceNodeId: simulatedSubChoiceNodeId as string,
          simulatedSubChoiceEdgeId: edgeOfSubChoice?.id,
          simulatedSubChoice,
        }

        await this.sessionPrismaAdapter.massSeedFakeSession(fakeSessionInputArgs);
      }));
    }));
  };

  generateFakeData = async (dialogueId: string, template: WorkspaceTemplate) => {
    const currentDate = new Date();
    const nrDaysBack = Array.from(Array(30)).map((empty, index) => index + 1);
    const datesBackInTime = nrDaysBack.map((amtDaysBack) => subDays(currentDate, amtDaysBack));

    const dialogueWithNodes = await this.dialoguePrismaAdapter.getDialogueWithNodesAndEdges(dialogueId);

    await this.dialoguePrismaAdapter.setGeneratedWithGenData(dialogueId, true);

    const rootNode = dialogueWithNodes?.questions.find((node) => node.isRoot);
    const edgesOfRootNode = dialogueWithNodes?.edges.filter((edge) => edge.parentNodeId === rootNode?.id);

    // Stop if no rootnode
    if (!rootNode) return;

    // For every particular date, generate a fake score
    await Promise.all(datesBackInTime.map(async (backDate) => {
      const simulatedRootVote: number = getRandomInt(100);

      const simulatedChoice = template.topics[Math.floor(Math.random() * template.topics.length)];
      const simulatedChoiceEdge = edgesOfRootNode?.find((edge) => edge.conditions.every((condition) => {
        if ((!condition.renderMin && !(condition.renderMin === 0)) || !condition.renderMax) return false;
        const isValid = condition?.renderMin < simulatedRootVote && condition?.renderMax > simulatedRootVote;

        return isValid;
      }));

      const simulatedChoiceNodeId = simulatedChoiceEdge?.childNode.id;

      if (!simulatedChoiceNodeId) return;

      const fakeSessionInputArgs: (
        {
          createdAt: Date;
          dialogueId: string;
          rootNodeId: string;
          simulatedRootVote: number;
          simulatedChoiceNodeId: string;
          simulatedChoiceEdgeId?: string;
          simulatedChoice: string;
        }) = { dialogueId, createdAt: backDate, rootNodeId: rootNode.id, simulatedRootVote, simulatedChoiceNodeId, simulatedChoiceEdgeId: simulatedChoiceEdge?.id, simulatedChoice }

      await this.sessionPrismaAdapter.createFakeSession(fakeSessionInputArgs);
    }));
  };

  // TODO: Offload all this work to redis for much better performance + Cache
  static getStatistics = async (dialogueId: string, startDate?: Date | null, endDate?: Date | null): Promise<StatisticsProps> => {
    // Fetch all relevant sessions
    const sessions = await SessionService.fetchSessionsByDialogue(dialogueId, { startDate, endDate });
    if (!sessions) { throw new Error('No sessions present'); }

    // Get the scoring-entries from each session.
    const scoreEntries = SessionService.getScoringEntriesFromSessions(
      sessions
    ).filter(isPresent) || [];

    // Then dresses it up as X/Y data for the lineChart
    const history: HistoryDataProps[] = scoreEntries?.map((entry) => ({
      x: entry?.creationDate.toUTCString() || null,
      y: entry?.sliderNodeEntry?.value || null,
      entryId: entry?.id || null,
      sessionId: entry?.sessionId || null,
    })).filter(isPresent) || [];

    const historyCloned = [...history];

    // Get text entries
    const nodeEntryTextValues = SessionService.getTextEntriesFromSessions(sessions).filter(isPresent);

    // Merge text-entries with relevant score by the root-slider based on their sessionId
    const historyBySession = _.keyBy(history, 'sessionId');
    const textAndScoreEntries = nodeEntryTextValues.map(val => ({
      ...val,
      x: val.sessionId ? historyBySession[val.sessionId].x : undefined,
      y: val.sessionId ? historyBySession[val.sessionId].y : undefined,
    }));

    // Get the top paths
    const isPositiveEntries = _.groupBy(textAndScoreEntries, (entry) => entry.y && entry.y > 50);
    const topNegativePath = DialogueService.getTopNPaths(isPositiveEntries.false || [], 3, 'negative') || [];
    const topPositivePath = DialogueService.getTopNPaths(isPositiveEntries.true || [], 3, 'positive') || [];

    // Get the most popular paths in general
    const mostPopularPath = _.maxBy([
      ...topNegativePath.map((pathItem) => ({ ...pathItem, basicSentiment: 'negative' })),
      ...topPositivePath.map((pathItem) => ({ ...pathItem, basicSentiment: 'positive' })),
    ], ((item) => item.quantity || null)) || null;

    return {
      history, topNegativePath, topPositivePath, mostPopularPath, nrInteractions: historyCloned.length || 0,
    };
  };

  deleteDialogue = async (dialogueId: string) => {
    const dialogue = await this.dialoguePrismaAdapter.read(dialogueId);

    const sessionIds = dialogue?.sessions.map((session) => session.id);
    const nodeEntries = await this.nodeEntryPrismaAdapter.getNodeEntriesBySessionIds(sessionIds || []);

    const nodeEntryIds = nodeEntries.map((nodeEntry) => nodeEntry.id);
    if (nodeEntryIds.length > 0) {
      await this.nodeEntryPrismaAdapter.deleteManySliderNodeEntries(nodeEntryIds);

      await this.nodeEntryPrismaAdapter.deleteManyTextBoxNodeEntries(nodeEntryIds);

      await this.nodeEntryPrismaAdapter.deleteManyRegistrationNodeEntries(nodeEntryIds);

      await this.nodeEntryPrismaAdapter.deleteManyLinkNodeEntries(nodeEntryIds);

      await this.nodeEntryPrismaAdapter.deleteManyChoiceNodeEntries(nodeEntryIds);

      await this.nodeEntryPrismaAdapter.deleteManyNodeEntries(sessionIds || []);
    }

    if (sessionIds && sessionIds.length > 0) {
      await this.sessionPrismaAdapter.deleteMany(sessionIds);
    }

    // //// Edge-related
    const edgeIds = dialogue?.edges && dialogue?.edges.map((edge) => edge.id);
    if (edgeIds && edgeIds.length > 0) {
      await this.edgePrismaAdapter.deleteConditionsByEdgeIds(edgeIds);
      await this.edgePrismaAdapter.deleteMany(edgeIds);
    }

    // //// Question-related
    const questionIds = dialogue?.questions.map((question) => question.id);
    if (questionIds && questionIds.length > 0) {
      await this.questionNodePrismaAdapter.deleteOptionsByQuestionIds(questionIds);

      await this.questionNodePrismaAdapter.deleteMany(questionIds);
    }
    const deletedDialogue = await this.dialoguePrismaAdapter.delete(dialogueId);

    return deletedDialogue;
  };

  initDialogue = async (
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{ id: string }> = [],
    language: LanguageEnum,
  ) => {
    try {
      const dialogue = await this.dialoguePrismaAdapter.create({
        data: DialogueService.constructDialogue(
          customerId, title, dialogueSlug, description, publicTitle, tags, language,
        ),
      });

      return dialogue;
    } catch (error) {
      // @ts-ignore
      if (error.code === 'P2002') {
        throw new UserInputError('dialogue:existing_slug');
      }

      return null;
    }
  };

  copyDialogue = async (
    input: CopyDialogueInputType,
  ) => {

    const tags = input?.dialogueTags?.entries && input?.dialogueTags?.entries?.length > 0
      ? input.dialogueTags?.entries?.map((tag: string) => ({ id: tag }))
      : [];

    const customer = await this.customerPrismaAdapter.findWorkspaceBySlug(input.customerSlug);

    if (!customer) throw new Error('Cant find customer related');

    const templateDialogue = await this.dialoguePrismaAdapter.getTemplateDialogue(input.templateId)

    const idMap: IdMapProps = {};
    const dialogue = await this.initDialogue(
      customer.id, input.title, input.dialogueSlug, input.description, input.publicTitle, tags, input.language,
    );

    if (!dialogue) throw new Error('Dialogue not copied');

    if (templateDialogue?.id) {
      idMap[templateDialogue?.id] = dialogue.id;
    }

    templateDialogue?.questions.forEach((question) => {
      if (!Object.keys(idMap).find((id) => id === question.id)) {
        idMap[question.id] = cuid();
      }
    });

    const updatedTemplateQuestions = templateDialogue?.questions.map((question) => {
      const mappedId = idMap[question.id];
      const mappedDialogueId = question.questionDialogueId && idMap[question.questionDialogueId];

      const mappedLinks = question.links.map((link) => {
        const { id, ...linkData } = link;
        const updateLink = { ...linkData, questionNodeId: idMap[mappedId] };
        return updateLink;
      });

      const mappedOverrideLeafId = question.overrideLeafId && idMap[question.overrideLeafId];
      const mappedOverrideLeaf = question.overrideLeafId ? { id: idMap[question.overrideLeafId] } : null;
      const mappedVideoEmbeddedNode: Prisma.VideoEmbeddedNodeCreateNestedOneWithoutQuestionNodeInput | undefined = question.videoEmbeddedNodeId
        ? { create: { videoUrl: question.videoEmbeddedNode?.videoUrl } }
        : undefined
      const mappedIsOverrideLeafOf = question.isOverrideLeafOf.map(({ id }) => ({ id: idMap[id] }));
      const mappedOptions = question.options.map((option) => {
        const { overrideLeafId, position, publicValue, value } = option;
        const mappedOverrideLeafId = overrideLeafId && idMap[overrideLeafId];

        return {
          position,
          publicValue,
          value,
          overrideLeafId: mappedOverrideLeafId || undefined,
        };
      });

      const mappedObject = {
        ...question,
        id: mappedId,
        videoEmbeddedNode: mappedVideoEmbeddedNode,
        questionDialogueId: mappedDialogueId,
        links: { create: mappedLinks },
        options: mappedOptions,
        overrideLeafId: mappedOverrideLeafId,
        overrideLeaf: mappedOverrideLeaf,
        isOverrideLeafOf: mappedIsOverrideLeafOf,
      };
      return mappedObject;
    });

    // Create leaf nodes
    const leafs = updatedTemplateQuestions?.filter((question) => question.isLeaf);
    const mappedLeafs: CreateQuestionsInput = leafs?.map((leaf) => ({
      id: leaf.id,
      isRoot: false,
      isLeaf: leaf.isLeaf,
      title: leaf.title,
      type: leaf.type,
      links: leaf.links?.create?.map((link) => link) || [],
      form: leaf.form ? {
        fields: leaf.form?.fields?.map((field) => ({
          label: field?.label,
          type: field?.type || 'shortText',
          isRequired: field?.isRequired || false,
          position: field?.position,
        })),
      } : undefined,
      sliderNode: leaf.sliderNode ? {
        markers: leaf?.sliderNode?.markers?.map((marker) => ({
          label: marker?.label,
          subLabel: marker?.subLabel,
          range: {
            start: marker?.range?.start,
            end: marker?.range?.end,
          },
        })),
      } : undefined,
    })) || [];
    await this.dialoguePrismaAdapter.createNodes(dialogue.id, mappedLeafs)

    // Create question nodes
    const questions = updatedTemplateQuestions?.filter((question) => !question.isLeaf);
    // TODO: Check if this map still works with new createNodes function (I don't think it does...)
    const mappedQuestions: CreateQuestionsInput = questions?.map((leaf) => ({
      id: leaf.id,
      isRoot: leaf.isRoot,
      isLeaf: leaf.isLeaf,
      title: leaf.title,
      type: leaf.type,
      options: leaf.options,
      overrideLeafId: leaf.overrideLeaf?.id,
      videoEmbeddedNode: leaf.videoEmbeddedNode?.create?.videoUrl
        ? { videoUrl: leaf.videoEmbeddedNode?.create?.videoUrl }
        : undefined,
      sliderNode: leaf.sliderNode ? {
        markers: leaf?.sliderNode?.markers?.map((marker) => ({
          label: marker?.label,
          subLabel: marker?.subLabel,
          range: {
            start: marker?.range?.start,
            end: marker?.range?.end,
          },
        })),
      } : undefined,
    })) || [];

    await this.dialoguePrismaAdapter.createNodes(dialogue.id, mappedQuestions);

    // Create edges
    const updatedTemplateEdges = templateDialogue?.edges.map((edge) => {
      const mappedConditions = edge.conditions.map((condition) => {
        const { id, edgeId, ...conditionData } = condition;
        const updateCondition = { ...conditionData };
        return updateCondition;
      });
      const mappedChildNode = { id: idMap[edge.childNodeId] };
      const mappedParentNode = { id: idMap[edge.parentNodeId] };
      const mappedObject = {
        parentNodeId: mappedParentNode.id,
        conditions: mappedConditions,
        childNodeId: mappedChildNode.id,
      };
      return mappedObject;
    }) || [];

    const updatedEdgesOfDialogue = await this.dialoguePrismaAdapter.createEdges(dialogue.id, updatedTemplateEdges);
    return updatedEdgesOfDialogue;
  };

  createDialogue = async (input: NexusGenInputs['CreateDialogueInputType']): Promise<Dialogue> => {
    const dialogueTags = input.tags?.entries?.map((tag: string) => ({ id: tag })) || [];

    const customers = await this.customerPrismaAdapter.getAllCustomersBySlug(input.customerSlug);

    // TODO: Put in validation function, or add validator service library
    if (!input.dialogueSlug) {
      throw new Error('Slug required, not found!');
    };

    if (!input.title) {
      throw new Error('Title required, not found!');
    };

    if (!input.description) {
      throw new Error('Description required, not found!');
    };

    if (!input.language) {
      throw new Error('Language required, not found!');
    };

    if (customers.length > 1) {
      // TODO: Make this a logger or something
      console.warn(`Multiple customers found with slug ${input.customerSlug}`);
    };

    const customer = customers?.[0];
    if (!customer) {
      throw new Error(`Customer not found with slug ${input.customerSlug}`);
    }

    // TODO: Rename seeddialogue to something like createFromTemplate, add to slug a -1 iterator
    if (input.contentType === 'SEED' && customer?.name) {
      return this.seedQuestionnare(
        customer?.id,
        input.dialogueSlug,
        customer?.name,
        input.title,
        input.description,
        dialogueTags,
        input.language,
      );
    }

    if (input.contentType === 'TEMPLATE' && input.templateDialogueId) {
      // FIXME: Tags are not copied over
      const copyDialogueInput: CopyDialogueInputType = {
        customerSlug: customer.slug,
        description: input.description,
        dialogueSlug: input.dialogueSlug,
        dialogueTags: input.tags,
        publicTitle: input.publicTitle || '',
        templateId: input.templateDialogueId,
        title: input.title,
        language: input.language,
      }
      return this.copyDialogue(copyDialogueInput);
    }

    const dialogue = await this.initDialogue(
      customer?.id,
      input.title,
      input.dialogueSlug,
      input.description,
      input.publicTitle || '',
      dialogueTags,
      input.language,
    );

    if (!dialogue) throw new ApolloError('customer:unable_to_create');

    // TODO: "Include "
    this.dialoguePrismaAdapter.update(dialogue.id, {
      questions: {
        create: {
          title: `What do you think about ${customer?.name} ?`,
          type: NodeType.SLIDER,
          isRoot: true,
        },
      },
    })

    // TODO: Make this dependent on input "template"
    await this.nodeService.createTemplateLeafNodes(defaultWorkspaceTemplate.leafNodes, dialogue.id);

    return dialogue;
  };

  seedQuestionnare = async (
    customerId: string,
    dialogueSlug: string,
    customerName: string,
    dialogueTitle: string = 'Default dialogue',
    dialogueDescription: string = 'Default questions',
    tags: Array<{ id: string }>,
    language: LanguageEnum = 'ENGLISH',
  ): Promise<Dialogue> => {
    const dialogue = await this.initDialogue(
      customerId, dialogueTitle, dialogueSlug, dialogueDescription, '', tags, language,
    );

    if (!dialogue) throw new Error('Dialogue not seeded');

    // TODO: Make this dependent on input "template"
    const leafs = await this.nodeService.createTemplateLeafNodes(defaultWorkspaceTemplate.leafNodes, dialogue.id);
    await this.nodeService.createTemplateNodes(dialogue.id, customerName, leafs);

    return dialogue;
  };

  uuidToPrismaIds = async (questions: Array<QuestionProps>, dialogueId: string) => {
    const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    const newQuestions = questions.filter(({ id }) => {
      const matchResult = id.match(v4);
      return matchResult ? matchResult.length > 0 : false;
    });

    const newMappedQuestions = await Promise.all(newQuestions.map(
      async ({ id, title, type }) => {
        const question = await this.nodeService.createQuestionNode(title, dialogueId, type);
        return { [id]: question.id };
      },
    ));

    const reducer = (accumulator: object, currentValue: object) => ({
      ...accumulator,
      ...currentValue,
    });

    const finalMapping = newMappedQuestions.reduce(reducer, {});
    const finalQuestions = questions.map((question) => {
      const matchResult = question.id.match(v4) || [];
      if (matchResult.length > 0) {
        question.id = finalMapping[question.id];
      };

      const updatedEdges = question.children?.map((edge) => {
        const matchParent = edge?.parentNode?.id?.match(v4) || [];
        const matchChild = edge.childNode.id.match(v4) || [];
        if (matchParent && matchParent.length > 0) {
          edge.parentNode.id = question.id;
        }
        if (matchChild && matchChild.length > 0) {
          edge.childNode.id = finalMapping[edge.childNode.id];
        }
        return edge;
      });

      question.children = updatedEdges?.length > 0 ? updatedEdges : [];
      return question;
    });

    return finalQuestions;
  };

  static calculateAverageDialogueScore = async (dialogueId: string, filters?: NexusGenInputs['DialogueFilterInputType']) => {
    const sessions = await SessionService.fetchSessionsByDialogue(dialogueId, {
      startDate: filters?.startDate ? new Date(filters?.startDate) : null,
      endDate: filters?.endDate ? new Date(filters?.endDate) : null,
    });

    if (!sessions) {
      return 0;
    }

    const scoringEntries = SessionService.getScoringEntriesFromSessions(sessions);

    const scores = _.mean((scoringEntries).map((entry) => entry?.sliderNodeEntry?.value)) || 0;

    return scores;
  };

  static getDialogueInteractionFeedItems = async (
    dialogueId: string,
  ): Promise<Array<NexusGenRootTypes['NodeEntry']>> => {
    const sessions = await SessionService.fetchSessionsByDialogue(dialogueId);

    if (!sessions) {
      return [];
    };

    const scoringEntriesFromSessions = SessionService.getScoringEntriesFromSessions(sessions);

    return scoringEntriesFromSessions;
  };
}

export default DialogueService;
