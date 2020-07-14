import { Dialogue, DialogueCreateInput,
  DialogueUpdateInput, Link, LinkCreateArgs, LinkCreateManyWithoutQuestionNodeInput, LinkCreateWithoutQuestionNodeInput, PrismaClient, QuestionNode, QuestionNodeCreateInput, QuestionOptionCreateManyWithoutQuestionNodeInput, Tag, TagWhereUniqueInput } from '@prisma/client';
import { isAfter, subDays } from 'date-fns';
import _ from 'lodash';
import cuid from 'cuid';

import { DialogueFilterInputType } from './Dialogue';
import { leafNodes, sliderType } from '../../data/seeds/default-data';
import NodeResolver from '../question/node-resolver';

const prisma = new PrismaClient();

interface IdMapProps {
  [details: string] : string;
}
interface LeafNodeProps {
  id: string;
  nodeId?: string;
  type?: string;
  title: string;
}

interface QuestionConditionProps {
  id?: number;
  conditionType: string;
  renderMin: number;
  renderMax: number;
  matchValue: string;
}

interface EdgeNodeProps {
  id: string;
  title: string;
}

interface EdgeChildProps {
  id?: string;
  conditions: [QuestionConditionProps];
  parentNode: EdgeNodeProps;
  childNode: EdgeNodeProps;
}

interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
}

interface QuestionProps {
  id: string;
  title: string;
  isRoot: boolean;
  isLeaf: boolean;
  type: string;
  overrideLeaf: LeafNodeProps;
  options: Array<QuestionOptionProps>;
  children: Array<EdgeChildProps>;
}

interface DialogueInputProps {
  data: {
    customerSlug: string;
    dialogueSlug: string;
    title: string;
    description: string;
    publicTitle: string;
    contentType: 'SCRATCH' | 'TEMPLATE' | 'SEED';
    templateDialogueId?: string;
    tags: any;
  }
}

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
      customer: {
        connect: { id: customerId },
      },
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
    console.log('ARGS: ', args);
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

  static getTopPaths = (groupedJoined: any) => {
    const countedPaths = _.countBy(groupedJoined, 'textValue');
    const o = _.sortBy(_.toPairs(countedPaths), 1).reverse();
    const countedPathsObjects = o.map((array) => ({ answer: array[0], quantity: array[1] }));
    const topPath = countedPathsObjects.length > 3
      ? countedPathsObjects.slice(0, 3) : countedPathsObjects;
    return topPath;
  };

  static getNextLineData = async (dialogueId: string, numberOfDaysBack: number, limit: number, offset: number) => {
    const currentDate = new Date();
    const filterDateTime = subDays(currentDate, numberOfDaysBack);
    const sessions = await prisma.session.findMany({
      skip: offset,
      take: limit,
      where: {
        dialogueId,
      },
      include: {
        nodeEntries: {
          select: {
            creationDate: true,
            depth: true,
            values: {
              select: {
                id: true,
                nodeEntryId: true,
                numberValue: true,
                textValue: true,
              },
            },
          },
        },
      },
    });

    const nodeEntries = sessions.flatMap((session) => session.nodeEntries);
    const nodeEntryValues = nodeEntries && nodeEntries.flatMap((nodeEntry) => (
      { creationDate: nodeEntry.creationDate,
        values: nodeEntry.values[0],
        depth: nodeEntry.depth }));
    const nodeEntryNumberValues = nodeEntryValues?.filter(
      (nodeEntryValue) => nodeEntryValue?.values?.numberValue
      && isAfter(nodeEntryValue.creationDate, filterDateTime)
    );
    const finalNodeEntryNumberValues = nodeEntryNumberValues?.map(
      (nodeEntryNumberValue) => (
        {
          x: nodeEntryNumberValue.creationDate,
          y: nodeEntryNumberValue.values.numberValue,
          nodeEntryId: nodeEntryNumberValue.values.nodeEntryId,
        }));
    const orderedFinalNodeEntryNumberValues = _.orderBy(finalNodeEntryNumberValues, ['x'], ['asc']);
    const lineChartData = orderedFinalNodeEntryNumberValues.map((entry) => (
      { x: entry.x.toUTCString(), y: entry.y }));
    return lineChartData;
  };

  static getLineData = async (dialogueId: string, numberOfDaysBack: number) => {
    const currentDate = new Date();
    const filterDateTime = subDays(currentDate, numberOfDaysBack);
    const sessions = await prisma.session.findMany({
      // skip: offset,
      // first: limit,
      where: {
        dialogueId,
      },
      include: {
        nodeEntries: {
          select: {
            creationDate: true,
            depth: true,
            values: {
              select: {
                id: true,
                nodeEntryId: true,
                numberValue: true,
                textValue: true,
              },
            },
          },
        },
      },
    });

    const nodeEntries = sessions.flatMap((session) => session.nodeEntries);
    const nodeEntryValues = nodeEntries && nodeEntries.flatMap((nodeEntry) => (
      { creationDate: nodeEntry.creationDate,
        values: nodeEntry.values[0],
        depth: nodeEntry.depth }));
    const nodeEntryNumberValues = nodeEntryValues?.filter(
      (nodeEntryValue) => nodeEntryValue?.values?.numberValue
      && isAfter(nodeEntryValue.creationDate, filterDateTime)
    );
    const finalNodeEntryNumberValues = nodeEntryNumberValues?.map(
      (nodeEntryNumberValue) => (
        {
          x: nodeEntryNumberValue.creationDate,
          y: nodeEntryNumberValue.values.numberValue,
          nodeEntryId: nodeEntryNumberValue.values.nodeEntryId,
        }));
    const orderedFinalNodeEntryNumberValues = _.orderBy(finalNodeEntryNumberValues, ['x'], ['asc']);
    const lineChartData = orderedFinalNodeEntryNumberValues.map((entry) => (
      { x: entry.x.toUTCString(), y: entry.y }));

    const nodeEntryTextValues = nodeEntryValues?.filter(
      (nodeEntryValue) => nodeEntryValue?.values?.textValue && nodeEntryValue?.depth === 1
      && isAfter(nodeEntryValue.creationDate, filterDateTime));
    const finalNodeEntryTextValues = nodeEntryTextValues?.map(
      (nodeEntryTextValue) => (
        { nodeEntryId: nodeEntryTextValue.values.nodeEntryId,
          textValue: nodeEntryTextValue.values.textValue }));
    const joined = _.merge(lineChartData, finalNodeEntryTextValues);
    const groupedJoined = _.groupBy(joined, (entry) => entry.y && entry.y > 50);
    const topNegativePath = DialogueService.getTopPaths(groupedJoined.false);
    const topPositivePath = DialogueService.getTopPaths(groupedJoined.true);
    return { lineChartData, topNegativePath, topPositivePath };
  };

  static getLineData_OLD = async (dialogueId: string, numberOfDaysBack: number) => {
    const currentDate = new Date();
    const filterDateTime = subDays(currentDate, numberOfDaysBack);

    const dialogue = await prisma.dialogue.findOne(
      {
        where: { id: dialogueId },
        include: {
          sessions: {
            include: {
              nodeEntries: {
                select: {
                  creationDate: true,
                  depth: true,
                  values: {
                    select: {
                      id: true,
                      nodeEntryId: true,
                      numberValue: true,
                      textValue: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    );
    const nodeEntries = dialogue?.sessions.flatMap((session) => session.nodeEntries);
    const nodeEntryValues = nodeEntries && nodeEntries.flatMap((nodeEntry) => (
      { creationDate: nodeEntry.creationDate,
        values: nodeEntry.values[0],
        depth: nodeEntry.depth }));
    const nodeEntryNumberValues = nodeEntryValues?.filter(
      (nodeEntryValue) => nodeEntryValue?.values?.numberValue
      && nodeEntryValue.creationDate > filterDateTime);
    const finalNodeEntryNumberValues = nodeEntryNumberValues?.map(
      (nodeEntryNumberValue) => (
        {
          x: nodeEntryNumberValue.creationDate,
          y: nodeEntryNumberValue.values.numberValue,
          nodeEntryId: nodeEntryNumberValue.values.nodeEntryId,
        }));
    const orderedFinalNodeEntryNumberValues = _.orderBy(finalNodeEntryNumberValues, ['x'], ['asc']);
    const lineChartData = orderedFinalNodeEntryNumberValues.map(
      (entry) => ({ x: entry.x.toUTCString(), y: entry.y }),
    );

    const nodeEntryTextValues = nodeEntryValues?.filter(
      (nodeEntryValue) => nodeEntryValue?.values?.textValue && nodeEntryValue?.depth === 1);
    const finalNodeEntryTextValues = nodeEntryTextValues?.map(
      (nodeEntryTextValue) => (
        { nodeEntryId: nodeEntryTextValue.values.nodeEntryId,
          textValue: nodeEntryTextValue.values.textValue }));
    const joined = _.merge(lineChartData, finalNodeEntryTextValues);
    const groupedJoined = _.groupBy(joined, (entry) => entry.y && entry.y > 50);
    const topNegativePath = DialogueService.getTopPaths(groupedJoined.false);
    const topPositivePath = DialogueService.getTopPaths(groupedJoined.true);
    return { lineChartData, topNegativePath, topPositivePath };
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
      await prisma.nodeEntryValue.deleteMany(
        {
          where: {
            nodeEntryId: {
              in: nodeEntryIds,
            },
          },
        },
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
    const questionnaire = await DialogueService.initDialogue(
      customerId, title, dialogueSlug, description, publicTitle, tags,
    );

    if (templateDialogue?.id) {
      idMap[templateDialogue?.id] = questionnaire.id;
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

    const updatedLeafsDialogue = await prisma.dialogue.update({
      where: {
        id: questionnaire.id,
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
    const updatedQuestionsDialogue = await prisma.dialogue.update({
      where: {
        id: questionnaire.id,
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
      const mappedDialogueId = edge.dialogueId && idMap[edge.dialogueId];
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
        id: questionnaire.id,
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

  static createDialogue = async (dialogueInputData: DialogueInputProps): Promise<Dialogue | null> => {
    const { data: { dialogueSlug, customerSlug, title, publicTitle, description, tags = [], contentType, templateDialogueId } } = dialogueInputData;

    let questionnaire = null;
    const dialogueTags = tags?.entries?.length > 0
      ? tags?.entries?.map((tag: string) => ({ id: tag }))
      : [];

    const customers = await prisma.customer.findMany({ where: { slug: customerSlug } });
    const customer = customers?.[0];

    if (!customer) {
      return null;
    }

    if (contentType === 'SEED') {
      if (customer?.name) {
        return DialogueService.seedQuestionnare(
          customer?.id,
          dialogueSlug,
          customer?.name,
          title,
          description,
          dialogueTags,
        );
      }
    }

    if (contentType === 'TEMPLATE' && templateDialogueId) {
      return DialogueService.copyDialogue(
        templateDialogueId, customer.id, title, dialogueSlug, description, publicTitle, tags,
      );
    }

    questionnaire = await DialogueService.initDialogue(
      customer?.id,
      title,
      dialogueSlug,
      description,
      publicTitle,
      dialogueTags,
    );

    await prisma.dialogue.update({
      where: {
        id: questionnaire.id,
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

    await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

    return questionnaire;
  };

  static seedQuestionnare = async (
    customerId: string,
    customerSlug: string,
    customerName: string,
    questionnaireTitle: string = 'Default questionnaire',
    questionnaireDescription: string = 'Default questions',
    tags: Array<{id: string}>,
  ): Promise<Dialogue> => {
    const questionnaire = await DialogueService.initDialogue(
      customerId, customerSlug, questionnaireTitle, questionnaireDescription, '', tags,
    );

    const leafs = await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

    await NodeResolver.createTemplateNodes(questionnaire.id, customerName, leafs);
    return questionnaire;
  };

  static uuidToPrismaIds = async (questions: Array<QuestionProps>, dialogueId: string) => {
    const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    const newQuestions = questions.filter(({ id }) => {
      const matchResult = id.match(v4);
      return matchResult ? matchResult.length > 0 : false;
    });

    const newMappedQuestions = await Promise.all(newQuestions.map(
      async ({ id, title, type }) => {
        const question = await NodeResolver.createQuestionNode(title, dialogueId, type);
        return { [id]: question.id };
      },
    ));

    const reducer = (accumulator: object, currentValue: object) => (
      { ...accumulator, ...currentValue }
    );
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

  static updateTopicBuilder = async (args: any) => {
    try {
      const questionnaireId: string = args.id || undefined;
      const { questions }: { questions: Array<any> } = args.topicData;
      const finalQuestions = await DialogueService.uuidToPrismaIds(questions, questionnaireId);
      await Promise.all(finalQuestions.map(async (question) => NodeResolver.updateQuestion(
        questionnaireId,
        question,
      )));

      return 'Succesfully updated topic(?)';
    } catch (e) {
      return `Something went wrong in update topic builder: ${e}`;
    }
  };

  static calculateAverageScore = async (dialogueId: string) => {
    const dialogue = await prisma.dialogue.findOne({
      where: { id: dialogueId },
      include: {
        sessions: {
          include: {
            nodeEntries: {
              include: {
                values: {
                  include: {
                    multiValues: {
                      select: {
                        numberValue: true,
                      },
                    },
                  },
                },
                relatedNode: true,
              },
            },
          },
        },
      },
    });

    // For each session, get the node-entry with isRoot (for now)
    const scores = dialogue?.sessions.map(
      (session) => session.nodeEntries.find(
        (entry) => entry.relatedNode?.isRoot,
      )?.values.find(
        (val) => val.numberValue
      )?.numberValue).filter((val) => val);

    const averageScore = _.mean(scores) || null;

    return averageScore || null;
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

  static interactionFeedItems = async (parent: Dialogue) => {
    const sessions = await prisma.session.findMany({
      where: {
        dialogueId: parent.id,
      },
      include: {
        nodeEntries: {
          include: {
            relatedNode: {
              select: {
                isRoot: true,
              },
            },
            values: {
              select: {
                numberValue: true,
                NodeEntry: {
                  select: {
                    depth: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const sessionsWithOnlyRoots = sessions.map((session) => (
      session?.nodeEntries.find((nodeEntry) => nodeEntry.depth === 0 && nodeEntry.relatedNode?.isRoot) ? session : null));

    return sessionsWithOnlyRoots.filter((session) => session);
  };
}

export default DialogueService;
