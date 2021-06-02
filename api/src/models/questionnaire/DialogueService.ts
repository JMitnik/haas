import { subDays } from 'date-fns';
import _, { cloneDeep } from 'lodash';
import cuid from 'cuid';

import { ApolloError, UserInputError } from 'apollo-server-express';
import {
  Dialogue, DialogueCreateInput, DialogueUpdateInput,
  NodeType,
  QuestionOptionCreateManyWithoutQuestionNodeInput, Tag, TagWhereUniqueInput, PrismaClient, SessionCreateInput
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import NodeService from '../QuestionNode/NodeService';
import filterDate from '../../utils/filterDate';
// eslint-disable-next-line import/no-cycle
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import {
  HistoryDataProps, HistoryDataWithEntry, IdMapProps,
  PathFrequency, QuestionProps, StatisticsProps
} from './DialogueTypes';
// eslint-disable-next-line import/no-cycle
import NodeEntryService, { NodeEntryWithTypes } from '../node-entry/NodeEntryService';
// eslint-disable-next-line import/no-cycle
import SessionService from '../session/SessionService';
import defaultWorkspaceTemplate, { WorkspaceTemplate } from '../templates/defaultWorkspaceTemplate';
import prisma from '../../config/prisma';
import { DialogueServiceType } from './DialogueServiceType';
import DialoguePrismaAdapter from './DialoguePrismaAdapter';
import { DialoguePrismaAdapterType } from './DialoguePrismaAdapterType';
import { CustomerPrismaAdapterType } from '../customer/CustomerPrismaAdapterType';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import { SessionPrismaAdapterType } from '../session/SessionPrismaAdapterType';
import SessionPrismaAdapter from '../session/SessionPrismaAdapter';
import { NodeEntryPrismaAdapterType } from '../node-entry/NodeEntryPrismaAdapterType';
import NodeEntryPrismaAdapter from '../node-entry/NodeEntryPrismaAdapter';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
class DialogueService implements DialogueServiceType {
  dialoguePrismaAdapter: DialoguePrismaAdapterType;
  customerPrismaAdapter: CustomerPrismaAdapterType;
  sessionPrismaAdapter: SessionPrismaAdapterType;
  nodeEntryPrismaAdapter: NodeEntryPrismaAdapterType;

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.nodeEntryPrismaAdapter = new NodeEntryPrismaAdapter(prismaClient);
  }

  async delete(dialogueId: string) {
    return this.dialoguePrismaAdapter.delete(dialogueId);
  }

  async findDialogueIdsByCustomerId(customerId: string) {
    const dialogueIdObjects = await this.dialoguePrismaAdapter.findDialogueIdsOfCustomer(customerId);
    const dialogueIds = dialogueIdObjects.map((dialogue) => dialogue.id);
    return dialogueIds;
  }

  static constructDialogue(
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{ id: string }> = [],
  ): DialogueCreateInput {
    const constructDialogueFragment = {
      customer: { connect: { id: customerId } },
      title,
      slug: dialogueSlug,
      description,
      publicTitle,
      questions: { create: [] },
      tags: {},
    };

    if (tags.length) {
      constructDialogueFragment.tags = { connect: tags.map((tag) => ({ id: tag.id })) };
    }

    return constructDialogueFragment;
  }

  static filterDialoguesBySearchTerm = (dialogues: Array<Dialogue & {
    tags: Tag[];
  }>, searchTerm: string) => dialogues.filter((dialogue) => {
    if (dialogue.title.toLowerCase().includes(
      searchTerm.toLowerCase(),
    )) { return true; }

    if (dialogue.publicTitle?.toLowerCase().includes(
      searchTerm.toLowerCase()
    )) { return true; }

    if (dialogue.tags.find((tag) => tag.name.toLowerCase().includes(
      searchTerm.toLowerCase(),
    ))) { return true; }

    return false;
  });

  static updateTags = (
    dbTags: Array<Tag>,
    newTags: Array<string>,
    updateDialogueArgs: DialogueUpdateInput,
  ) => {
    const newTagObjects = newTags.map((tag) => ({ id: tag }));
    console.log('new tags: ', newTags);

    const deleteTagObjects: TagWhereUniqueInput[] = [];
    dbTags.forEach((tag) => {
      if (!newTags.includes(tag.id)) {
        deleteTagObjects.push({ id: tag.id });
      }
    });

    const tagUpdateArgs: any = {};
    if (newTagObjects.length > 0) {
      tagUpdateArgs.connect = newTagObjects;
    }

    if (deleteTagObjects.length > 0) {
      tagUpdateArgs.disconnect = deleteTagObjects;
    }
    updateDialogueArgs.tags = tagUpdateArgs;
    console.log('updateTags: ', updateDialogueArgs.tags);
    return updateDialogueArgs;
  };

  editDialogue = async (args: any) => {
    const { customerSlug, dialogueSlug, title, description, publicTitle, tags, isWithoutGenData } = args;

    const dbDialogue = await this.customerPrismaAdapter.getDialogueTags(customerSlug, dialogueSlug);

    let updateDialogueArgs: DialogueUpdateInput = { title, description, publicTitle, isWithoutGenData };
    if (dbDialogue?.tags) {
      updateDialogueArgs = DialogueService.updateTags(dbDialogue.tags, tags.entries, updateDialogueArgs);
    }

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

  generateFakeData = async (dialogueId: string, template: WorkspaceTemplate) => {
    const currentDate = new Date();
    const nrDaysBack = Array.from(Array(30)).map((empty, index) => index + 1);
    const datesBackInTime = nrDaysBack.map((amtDaysBack) => subDays(currentDate, amtDaysBack));

    const dialogueWithNodes = await this.dialoguePrismaAdapter.getDialogueWithNodesAndEdges(dialogueId);

    await this.dialoguePrismaAdapter.update(dialogueId, { wasGeneratedWithGenData: true });

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
          createdAt: Date,
          dialogueId: string,
          rootNodeId: string,
          simulatedRootVote: number,
          simulatedChoiceNodeId: string,
          simulatedChoiceEdgeId?: string,
          simulatedChoice: string,
        }) = { dialogueId, createdAt: backDate, rootNodeId: rootNode.id, simulatedRootVote, simulatedChoiceNodeId, simulatedChoiceEdgeId: simulatedChoiceEdge?.id, simulatedChoice }

      await this.sessionPrismaAdapter.createFakeSession(fakeSessionInputArgs);
    }));
  };

  // TODO: Offload all this work to redis for much better performance + Cache
  static getStatistics = async (dialogueId: string, startDate?: Date | null, endDate?: Date | null): Promise<StatisticsProps> => {
    const sessions = await SessionService.fetchSessionsByDialogue(dialogueId, { startDate, endDate });

    if (!sessions) { throw new Error('No sessions present'); }

    const scoreEntries = SessionService.getScoringEntriesFromSessions(sessions).filter(isPresent) || [];

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
      await prisma.questionCondition.deleteMany(
        {
          where: {
            edgeId: {
              in: edgeIds,
            },
          },
        },
      );

      await prisma.edge.deleteMany(
        {
          where: {
            id: {
              in: edgeIds,
            },
          },
        },
      );
    }

    // //// Question-related
    const questionIds = dialogue?.questions.map((question) => question.id);
    if (questionIds && questionIds.length > 0) {
      await prisma.questionOption.deleteMany(
        {
          where: {
            questionNodeId: {
              in: questionIds,
            },
          },
        },
      );

      await prisma.questionNode.deleteMany(
        {
          where: {
            id: {
              in: questionIds,
            },
          },
        },
      );
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
  ) => {
    try {
      const dialogue = await this.dialoguePrismaAdapter.create({
        data: DialogueService.constructDialogue(
          customerId, title, dialogueSlug, description, publicTitle, tags,
        ),
      });

      return dialogue;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UserInputError('dialogue:existing_slug');
      }

      return null;
    }
  };

  copyDialogue = async (
    templateId: string,
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{ id: string }> = []) => {
    const templateDialogue = await this.dialoguePrismaAdapter.getTemplateDialogue(templateId)

    const idMap: IdMapProps = {};
    const dialogue = await this.initDialogue(
      customerId, title, dialogueSlug, description, publicTitle, tags,
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
      const mappedIsOverrideLeafOf = question.isOverrideLeafOf.map(({ id }) => ({ id: idMap[id] }));
      const mappedOptions: QuestionOptionCreateManyWithoutQuestionNodeInput = { create: question.options };
      const mappedObject = {
        ...question,
        id: mappedId,
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
    await this.dialoguePrismaAdapter.update(dialogue.id, {
      questions: {
        create: leafs?.map((leaf) => ({
          id: leaf.id,
          isRoot: false,
          isLeaf: leaf.isLeaf,
          title: leaf.title,
          links: leaf.links,
          type: leaf.type,
          form: leaf.form ? {
            create: {
              fields: {
                create: leaf.form?.fields?.map((field) => ({
                  label: field?.label,
                  type: field?.type || 'shortText',
                  isRequired: field?.isRequired || false,
                  position: field?.position,
                })),
              },
            },
          } : undefined,
          sliderNode: leaf.sliderNode ? {
            create: {
              markers: {
                create: leaf?.sliderNode?.markers?.map((marker) => ({
                  label: marker?.label,
                  subLabel: marker?.subLabel,
                  range: {
                    create: {
                      start: marker?.range?.start,
                      end: marker?.range?.end,
                    },
                  },
                })),
              },
            },
          } : undefined,
        })),
      },
    });

    // Create questio nodes
    const questions = updatedTemplateQuestions?.filter((question) => !question.isLeaf);
    await this.dialoguePrismaAdapter.update(dialogue.id, {
      questions: {
        create: questions?.map((leaf) => ({
          id: leaf.id,
          isRoot: leaf.isRoot,
          isLeaf: leaf.isLeaf,
          title: leaf.title,
          options: leaf.options,
          overrideLeaf: leaf.overrideLeaf?.id ? {
            connect: {
              id: leaf.overrideLeaf.id,
            }
          } : undefined,
          type: leaf.type,
          sliderNode: leaf.sliderNode ? {
            create: {
              markers: {
                create: leaf?.sliderNode?.markers?.map((marker) => ({
                  label: marker?.label,
                  subLabel: marker?.subLabel,
                  range: {
                    create: {
                      start: marker?.range?.start,
                      end: marker?.range?.end,
                    },
                  },
                })),
              },
            },
          } : undefined,
        })) || [],
      },
    });

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
        parentNode: { connect: mappedParentNode },
        conditions: { create: mappedConditions },
        childNode: { connect: mappedChildNode },
      };
      return mappedObject;
    });

    const updatedEdgesDialogue = await this.dialoguePrismaAdapter.update(dialogue.id, {
      edges: {
        create: updatedTemplateEdges?.map((edge) => ({
          parentNode: edge.parentNode,
          conditions: edge.conditions,
          childNode: edge.childNode,
        })),
      },
    });

    return updatedEdgesDialogue;
  };

  createDialogue = async (input: NexusGenInputs['CreateDialogueInputType']): Promise<Dialogue> => {
    const dialogueTags = input.tags?.entries?.map((tag: string) => ({ id: tag })) || [];

    const customers = await this.customerPrismaAdapter.getAllCustomersBySlug(input.customerSlug);

    // TODO: Put in validation function, or add validator service library
    if (!input.dialogueSlug) {
      throw new Error('Slug required, not found!');
    }

    if (!input.title) {
      throw new Error('Title required, not found!');
    }

    if (!input.description) {
      throw new Error('Description required, not found!');
    }

    if (customers.length > 1) {
      // TODO: Make this a logger or something
      console.warn(`Multiple customers found with slug ${input.customerSlug}`);
    }

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
      );
    }

    if (input.contentType === 'TEMPLATE' && input.templateDialogueId) {
      return this.copyDialogue(
        input.templateDialogueId,
        customer.id,
        input.title,
        input.dialogueSlug,
        input.description,
        input.publicTitle || '',
        [],
      );
    }

    const dialogue = await this.initDialogue(
      customer?.id,
      input.title,
      input.dialogueSlug,
      input.description,
      input.publicTitle || '',
      dialogueTags,
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
    await NodeService.createTemplateLeafNodes(defaultWorkspaceTemplate.leafNodes, dialogue.id);

    return dialogue;
  };

  seedQuestionnare = async (
    customerId: string,
    dialogueSlug: string,
    customerName: string,
    dialogueTitle: string = 'Default dialogue',
    dialogueDescription: string = 'Default questions',
    tags: Array<{ id: string }>,
  ): Promise<Dialogue> => {
    const dialogue = await this.initDialogue(
      customerId, dialogueTitle, dialogueSlug, dialogueDescription, '', tags,
    );

    if (!dialogue) throw new Error('Dialogue not seeded');

    // TODO: Make this dependent on input "template"
    const leafs = await NodeService.createTemplateLeafNodes(defaultWorkspaceTemplate.leafNodes, dialogue.id);
    await NodeService.createTemplateNodes(dialogue.id, customerName, leafs);

    return dialogue;
  };

  static uuidToPrismaIds = async (questions: Array<QuestionProps>, dialogueId: string) => {
    const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    const newQuestions = questions.filter(({ id }) => {
      const matchResult = id.match(v4);
      return matchResult ? matchResult.length > 0 : false;
    });

    const newMappedQuestions = await Promise.all(newQuestions.map(
      async ({ id, title, type }) => {
        const question = await NodeService.createQuestionNode(title, dialogueId, type);
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
      }

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
    }

    const scoringEntriesFromSessions = SessionService.getScoringEntriesFromSessions(sessions);

    return scoringEntriesFromSessions;
  };
}

export default DialogueService;
