import { Dialogue, DialogueCreateInput, DialogueUpdateInput, NodeEntry, PrismaClient, Tag, TagUpdateManyDataInput, TagWhereUniqueInput } from '@prisma/client';
import { isAfter, subDays } from 'date-fns';
import { leafNodes, sliderType } from '../../data/seeds/default-data';
import NodeResolver from '../question/node-resolver';
import _ from 'lodash';

const prisma = new PrismaClient();
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

class DialogueResolver {
  static constructDialogue(customerId: string,
    title: string,
    description: string,
    publicTitle: string = '',
    tags: Array<{id: string}> = []): DialogueCreateInput {
    console.log('construct tags: ', tags);
    return {
      customer: {
        connect: {
          id: customerId,
        },
      },
      title,
      description,
      publicTitle,
      questions: {
        create: [],
      },
      tags: {
        connect: tags.map((tag) => ({ id: tag.id })),
      },
    };
  }

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
    const { dialogueId, title, description, publicTitle, tags } = args;
    const dbDialogue = await prisma.dialogue.findOne({ where: { id: dialogueId },
      include: {
        tags: true,
      } });

    let updateDialogueArgs: DialogueUpdateInput = { title, description, publicTitle };
    if (dbDialogue?.tags) {
      updateDialogueArgs = DialogueResolver.updateTags(dbDialogue.tags, tags.entries, updateDialogueArgs);
    }

    return prisma.dialogue.update({
      where: {
        id: dialogueId,
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
      first: limit,
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
    const topNegativePath = DialogueResolver.getTopPaths(groupedJoined.false);
    const topPositivePath = DialogueResolver.getTopPaths(groupedJoined.true);
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
    const topNegativePath = DialogueResolver.getTopPaths(groupedJoined.false);
    const topPositivePath = DialogueResolver.getTopPaths(groupedJoined.true);
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
    description: string,
    publicTitle: string = '',
    tags: Array<{id: string}> = [],
  ) => prisma.dialogue.create({
    data: DialogueResolver.constructDialogue(
      customerId, title, description, publicTitle, tags,
    ),
  });

  static createDialogue = async (args: any): Promise<Dialogue> => {
    const { customerId, title, description, publicTitle, isSeed, tags } = args;
    let questionnaire = null;
    const dialogueTags = tags?.entries?.length > 0
      ? tags?.entries?.map((tag: string) => ({ id: tag }))
      : [];

    const customer = await prisma.customer.findOne({ where: { id: customerId } });

    if (isSeed) {
      if (customer?.name) {
        return DialogueResolver.seedQuestionnare(customerId, customer?.name, title, description, dialogueTags);
      }
    }
    questionnaire = await DialogueResolver.initDialogue(
      customerId, title, description, publicTitle, dialogueTags,
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
    customerName: string,
    questionnaireTitle: string = 'Default questionnaire',
    questionnaireDescription: string = 'Default questions',
    tags: Array<{id: string}>,
  ): Promise<Dialogue> => {
    const questionnaire = await DialogueResolver.initDialogue(
      customerId, questionnaireTitle, questionnaireDescription, '', tags,
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
      const finalQuestions = await DialogueResolver.uuidToPrismaIds(questions, questionnaireId);
      await Promise.all(finalQuestions.map(async (question) => NodeResolver.updateQuestion(
        questionnaireId,
        question,
      )));

      return 'Succesfully updated topic(?)';
    } catch (e) {
      return `Something went wrong in update topic builder: ${e}`;
    }
  };

  static getQuestionnaireAggregatedData = async (parent: any, args: any) => {
    const { dialogueId } = args;

    // const customerName = (await prisma.questionnaire({ id: dialogueId }).customer()).name;
    const customer = await (prisma.dialogue.findOne({ where: { id: dialogueId } }).customer());
    const customerName = customer?.name;

    const dialogue: Dialogue | null = (await prisma.dialogue.findOne(
      { where: { id: dialogueId } },
    ));

    if (dialogue) {
      const { title, description, creationDate, updatedAt } = dialogue;

      const questionNodes = await prisma.questionNode.findMany({
        where: {
          questionDialogueId: dialogueId,
        },
      });

      const questionNodeIds = questionNodes.map((qNode) => qNode.id);

      const nodeEntries = await prisma.nodeEntry.findMany({
        where: {
          relatedNodeId: {
            in: questionNodeIds,
          },
        },
      }) || [];

      const aggregatedNodeEntries = await Promise.all(nodeEntries.map(async ({ id }) => {
        const values = await prisma.nodeEntry.findOne({ where: { id } }).values();
        const nodeEntry = await prisma.nodeEntry.findOne({ where: { id } });
        const session = (await prisma.nodeEntry.findOne({ where: { id } }).session());
        const sessionId = session?.id;

        const mappedResult = {
          sessionId,
          createdAt: nodeEntry?.creationDate,
          value: values[0].numberValue ? values[0].numberValue : -1,
        };
        return mappedResult;
      })) || [];

      const filterNodes = aggregatedNodeEntries.filter((node) => node?.value !== -1) || [];

      const filteredNodeData = (filterNodes.map((node) => node?.value)) || [];

      const nrEntries = filteredNodeData.reduce(
        (total = 0, previousValue) => total + previousValue, 0,
      );

      const averageSliderResult = (
        filteredNodeData.length > 0 && nrEntries / filteredNodeData.length).toString()
        || 'N/A';

      const orderedTimelineEntries = _.orderBy(filterNodes,
        (filterNode) => filterNode.createdAt, 'desc') || [];

      return {
        customerName,
        title,
        timelineEntries: orderedTimelineEntries,
        description,
        creationDate,
        updatedAt,
        average: averageSliderResult,
        totalNodeEntries: filterNodes.length,
      };
    }

    // TODO: What will we return here?
    return {};
  };
}

export default DialogueResolver;
