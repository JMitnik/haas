import { subDays } from 'date-fns';
import _ from 'lodash';
import cuid from 'cuid';

import { Dialogue, DialogueCreateInput, DialogueUpdateInput,
  QuestionOptionCreateManyWithoutQuestionNodeInput, Tag, TagWhereUniqueInput } from '@prisma/client';
import { leafNodes, sliderType } from '../../data/seeds/default-data';
import NodeService from '../question/NodeService';
// eslint-disable-next-line import/no-cycle
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
// eslint-disable-next-line import/no-cycle
import { HistoryDataProps, IdMapProps, PathFrequency, QuestionProps, StatisticsProps } from './DialogueTypes';
// eslint-disable-next-line import/no-cycle
import SessionService from '../session/SessionService';
import prisma from '../../prisma';

class DialogueService {
  static constructDialogue(
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{id: string}> = [],
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
    return updateDialogueArgs;
  };

  static editDialogue = async (args: any) => {
    const { customerSlug, dialogueSlug, title, description, publicTitle, tags } = args;
    const customer = await prisma.customer.findOne({
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

    let updateDialogueArgs: DialogueUpdateInput = { title, description, publicTitle };
    if (dbDialogue?.tags) {
      updateDialogueArgs = DialogueService.updateTags(dbDialogue.tags, tags.entries, updateDialogueArgs);
    }

    return prisma.dialogue.update({
      where: {
        id: dbDialogue?.id,
      },
      data: updateDialogueArgs,
    });
  };

  /**
   * Get top popular N paths based on occurence frequency.
   * @param groupedJoined
   * @param nPaths
   */
  static getTopNPaths = (groupedJoined: any, nPaths: number = 3) => {
    const countedPaths = _.countBy(groupedJoined, 'textValue');

    // Built in cleanup
    Object.keys(countedPaths).forEach((path) => path === 'undefined' && delete countedPaths[path]);

    const countTuples = _.sortBy(_.toPairs(countedPaths), 1).reverse();
    const pathFrequencies: PathFrequency[] = countTuples.map(([answer, quantity]) => ({
      answer,
      quantity,
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
    const sessions = await SessionService.getDialogueSessions(dialogueId, { limit, offset, startDate });

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

  static getStatistics = async (dialogueId: string, numberOfDaysBack: number): Promise<StatisticsProps> => {
    const startDate = subDays(new Date(), numberOfDaysBack);
    const sessions = await SessionService.getDialogueSessions(dialogueId, { startDate });

    if (!sessions) { throw new Error('No sessions present'); }

    const scoreEntries = SessionService.getScoringEntriesFromSessions(sessions);

    // Then dresses it up as X/Y data for the lineChart
    const history: HistoryDataProps[] = scoreEntries?.map((entry) => ({
      x: entry?.creationDate.toUTCString() || null,
      y: entry?.sliderNodeEntry?.value || null,
      entryId: entry?.id || null,
    })) || [];

    const nodeEntryTextValues = await SessionService.getTextEntriesFromSessions(sessions);

    // TODO: This is where I left off
    const textAndScoreEntries = _.merge(history, nodeEntryTextValues);
    const isPositiveEntries = _.groupBy(textAndScoreEntries, (entry) => entry.y && entry.y > 50);

    const topNegativePath = DialogueService.getTopNPaths(isPositiveEntries.false, 3) || [];
    const topPositivePath = DialogueService.getTopNPaths(isPositiveEntries.true, 3) || [];

    return { history, topNegativePath, topPositivePath };
  };

  static deleteDialogue = async (dialogueId: string) => {
    const dialogue = await prisma.dialogue.findOne({
      where: {
        id: dialogueId,
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
          },
        },
        sessions: {
          select: {
            id: true,
          },
        },
      },
    });

    const sessionIds = dialogue?.sessions.map((session) => session.id);
    const nodeEntries = await prisma.nodeEntry.findMany({
      where: {
        sessionId: {
          in: sessionIds,
        },
      },
    });

    const nodeEntryIds = nodeEntries.map((nodeEntry) => nodeEntry.id);
    if (nodeEntryIds.length > 0) {
      // TODO: Bring it back
      await prisma.sliderNodeEntry.deleteMany(
        { where: { nodeEntryId: { in: nodeEntryIds } } },
      );

      await prisma.textboxNodeEntry.deleteMany(
        { where: { nodeEntryId: { in: nodeEntryIds } } },
      );

      await prisma.registrationNodeEntry.deleteMany(
        { where: { nodeEntryId: { in: nodeEntryIds } } },
      );

      await prisma.linkNodeEntry.deleteMany(
        { where: { nodeEntryId: { in: nodeEntryIds } } },
      );

      await prisma.choiceNodeEntry.deleteMany(
        { where: { nodeEntryId: { in: nodeEntryIds } } },
      );

      await prisma.nodeEntry.deleteMany(
        {
          where: {
            sessionId: {
              in: sessionIds,
            },
          },
        },
      );
    }

    if (sessionIds && sessionIds.length > 0) {
      await prisma.session.deleteMany(
        {
          where: {
            id: {
              in: sessionIds,
            },
          },
        },
      );
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

    const deletedDialogue = await prisma.dialogue.delete({
      where: {
        id: dialogueId,
      },
    });
    return deletedDialogue;
  };

  static dialogues = async () => {
    const dialogues = prisma.dialogue.findMany();
    return dialogues;
  };

  static initDialogue = async (
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{id: string}> = [],
  ) => {
    const dialogue = prisma.dialogue.create({
      data: DialogueService.constructDialogue(
        customerId, title, dialogueSlug, description, publicTitle, tags,
      ),
    });

    return dialogue;
  };

  static copyDialogue = async (
    templateId: string,
    customerId: string,
    title: string,
    dialogueSlug: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{id: string}> = []) => {
    const templateDialogue = await prisma.dialogue.findOne({
      where: {
        id: templateId,
      },
      include: {
        edges: {
          include: {
            conditions: true,
            childNode: {
              select: {
                id: true,
              },
            },
            parentNode: {
              select: {
                id: true,
              },
            },
          },
        },
        questions: {
          include: {
            links: true,
            options: {
              select: {
                publicValue: true,
                value: true,
              },
            },
            overrideLeaf: {
              select: {
                id: true,
              },
            },
            isOverrideLeafOf: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const idMap: IdMapProps = {};
    const dialogue = await DialogueService.initDialogue(
      customerId, title, dialogueSlug, description, publicTitle, tags,
    );

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

    await prisma.dialogue.update({
      where: {
        id: dialogue.id,
      },
      data: {
        questions: {
          create: leafs?.map((leaf) => ({
            id: leaf.id,
            isRoot: false,
            isLeaf: leaf.isLeaf,
            title: leaf.title,
            links: leaf.links,
            type: leaf.type,
          })),
        },
      },
      include: {
        questions: {
          include: {
            links: true,
            options: {
              select: {
                publicValue: true,
                value: true,
              },
            },
          },

        },

      },
    });

    // Create questio nodes
    const questions = updatedTemplateQuestions?.filter((question) => !question.isLeaf);
    await prisma.dialogue.update({
      where: {
        id: dialogue.id,
      },
      data: {
        questions: {
          create: questions?.map((leaf) => ({
            id: leaf.id,
            isRoot: leaf.isRoot,
            isLeaf: leaf.isLeaf,
            title: leaf.title,
            options: leaf.options,
            overrideLeaf: leaf.overrideLeaf && { connect: leaf.overrideLeaf },
            type: leaf.type,
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: {
              select: {
                publicValue: true,
                value: true,
              },
            },
          },
        },
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

    const updatedEdgesDialogue = await prisma.dialogue.update({
      where: {
        id: dialogue.id,
      },
      data: {
        edges: {
          create: updatedTemplateEdges?.map((edge) => ({
            parentNode: edge.parentNode,
            conditions: edge.conditions,
            childNode: edge.childNode,
          })),
        },
      },
    });

    return updatedEdgesDialogue;
  };

  static createDialogue = async (input: NexusGenInputs['AddDialogueInput']): Promise<Dialogue> => {
    const dialogueTags = input.tags?.entries?.map((tag: string) => ({ id: tag })) || [];

    const customers = await prisma.customer.findMany({ where: { slug: input.customerSlug || undefined } });

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

    if (!input.publicTitle) {
      throw new Error('Public title required');
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
      return DialogueService.seedQuestionnare(
        customer?.id,
        input.dialogueSlug,
        customer?.name,
        input.title,
        input.description,
        dialogueTags,
      );
    }

    if (input.contentType === 'TEMPLATE' && input.templateDialogueId) {
      return DialogueService.copyDialogue(
        input.templateDialogueId,
        customer.id,
        input.title,
        input.dialogueSlug,
        input.description,
        input.publicTitle,
        [],
      );
    }

    const dialogue = await DialogueService.initDialogue(
      customer?.id,
      input.title,
      input.dialogueSlug,
      input.description,
      input.publicTitle,
      dialogueTags,
    );

    // TODO: "Include "
    await prisma.dialogue.update({
      where: {
        id: dialogue.id,
      },
      data: {
        questions: {
          create: {
            title: `What do you think about ${customer?.name} ?`,
            type: sliderType,
            isRoot: true,
          },
        },
      },
    });

    await NodeService.createTemplateLeafNodes(leafNodes, dialogue.id);

    return dialogue;
  };

  static seedQuestionnare = async (
    customerId: string,
    customerSlug: string,
    customerName: string,
    dialogueTitle: string = 'Default dialogue',
    dialogueDescription: string = 'Default questions',
    tags: Array<{id: string}>,
  ): Promise<Dialogue> => {
    const dialogue = await DialogueService.initDialogue(
      customerId, customerSlug, dialogueTitle, dialogueDescription, '', tags,
    );

    const leafs = await NodeService.createTemplateLeafNodes(leafNodes, dialogue.id);

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

  static calculateAverageDialogueScore = async (dialogueId: string) => {
    const sessions = await SessionService.getDialogueSessions(dialogueId);

    if (!sessions) {
      return 0;
    }

    const scoringEntries = SessionService.getScoringEntriesFromSessions(sessions);

    const scores = _.mean((scoringEntries).map((entry) => entry?.sliderNodeEntry)) || 0;

    return scores;
  };

  static countInteractions = async (dialogueId: string) => {
    const dialogue = await prisma.dialogue.findOne({
      where: { id: dialogueId },
      include: {
        sessions: true,
      },
    });

    return dialogue?.sessions.length;
  };

  static getDialogueInteractionFeedItems = async (
    dialogueId: string,
  ): Promise<Array<NexusGenRootTypes['NodeEntry']>> => {
    const sessions = await SessionService.getDialogueSessions(dialogueId);

    if (!sessions) {
      return [];
    }

    const scoringEntriesFromSessions = SessionService.getScoringEntriesFromSessions(sessions);

    return scoringEntriesFromSessions;
  };
}

export default DialogueService;
