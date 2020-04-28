import _ from 'lodash';
import { PrismaClient, Dialogue, DialogueCreateInput, QuestionNode } from '@prisma/client';
// or const { PrismaClient } = require('@prisma/client')

// import { prisma, Questionnaire, NodeType,
//   QuestionnaireCreateInput, QuestionNode } from '../../generated/prisma-client/index';

import NodeResolver from '../question/node-resolver';
import { leafNodes } from '../../data/seeds/default-data';

const prisma = new PrismaClient();
interface LeafNodeProps {
  id: string;
  nodeId?: string;
  type?: string;
  title: string;
}

interface QuestionConditionProps {
  id?: string;
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
  id?: string;
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
    leafs: Array<QuestionNode> = []): DialogueCreateInput {
    return {
      customer: {
        connect: {
          id: customerId,
        },
      },
      title,
      description,
      publicTitle,
      // leafs: leafs.length > 0 ? {
      //   connect: leafs.map((leaf) => ({ id: leaf.id })),
      // } : {
      //   create: [],
      // },
      questions: {
        create: [],
      },
    };
  }

  static dialogues = async () => {
    const dialogues = prisma.dialogue.findMany();
    return dialogues;
  };

  static createDialogue = async (
    customerId: string,
    title: string,
    description: string,
    publicTitle: string = '',
    leafs: Array<QuestionNode> = []) => prisma.dialogue.create({
    data: DialogueResolver.constructDialogue(
      customerId, title, description, publicTitle, leafs,
    ),
  });

  // static createNewQuestionnaire = async (parent: any, args: any): Promise<Dialogue> => {
  //   const { customerId, title, description, publicTitle, isSeed } = args;
  //   let questionnaire = null;

  //   if (isSeed) {
  //     const customer = await prisma.customer.findOne({ where: { id: customerId } });

  //     if (customer?.name) {
  //       return DialogueResolver.seedQuestionnare(customerId, customer?.name, title, description);
  //     }
  //   }
  //   questionnaire = await DialogueResolver.createDialogue(
  //     customerId, title, description, publicTitle,
  //   );

  //   await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

  //   return questionnaire;
  // };

  // static seedQuestionnare = async (
  //   customerId: string,
  //   customerName: string,
  //   questionnaireTitle: string = 'Default questionnaire',
  //   questionnaireDescription: string = 'Default questions',
  // ): Promise<Questionnaire> => {
  //   const questionnaire = await DialogueResolver.createDialogue(
  //     customerId, questionnaireTitle, questionnaireDescription, '',
  //   );

  //   const leafs = await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

  //   await NodeResolver.createTemplateNodes(questionnaire.id, customerName, leafs);
  //   return questionnaire;
  // };

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

  // static updateTopicBuilder = async (parent: any, args: any) => {
  //   try {
  //     const questionnaireId: string = args.id || undefined;
  //     const { questions }: { questions: Array<any> } = args.topicData;
  //     const finalQuestions = await DialogueResolver.uuidToPrismaIds(questions, questionnaireId);
  //     await Promise.all(finalQuestions.map((question) => NodeResolver.updateQuestion(
  //       questionnaireId,
  //       question,
  //     )));

  //     return 'Succesfully updated topic(?)';
  //   } catch (e) {
  //     return `Something went wrong in update topic builder: ${e}`;
  //   }
  // };

  static getQuestionnaireAggregatedData = async (parent: any, args: any) => {
    const { dialogueId } = args;

    // const customerName = (await prisma.questionnaire({ id: dialogueId }).customer()).name;
    const customer = await (prisma.dialogue.findOne({ where: { id: dialogueId } }).customer());
    const customerName = customer?.name;

    const dialogue: Dialogue | null = (await prisma.dialogue.findOne({ where: { id: dialogueId } }));

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
