import _ from 'lodash';
import { prisma,
  Questionnaire, QuestionnaireCreateInput, QuestionNode } from '../../generated/prisma-client/index';

import NodeResolver from '../question/node-resolver';
import { leafNodes } from '../../../data/seeds/seedDataStructure';

class DialogueResolver {
  static constructDialogue(customerId: string,
    title: string,
    description: string,
    publicTitle: string = '',
    leafs: Array<QuestionNode> = []): QuestionnaireCreateInput {
    return {
      customer: {
        connect: {
          id: customerId,
        },
      },
      title,
      description,
      publicTitle,
      leafs: leafs.length > 0 ? {
        connect: leafs.map((leaf) => ({ id: leaf.id })),
      } : {
        create: [],
      },
      questions: {
        create: [],
      },
    };
  }

  static createDialogue = async (
    customerId: string,
    title: string,
    description: string,
    publicTitle: string = '',
    leafs: Array<QuestionNode> = []) => prisma.createQuestionnaire(
    DialogueResolver.constructDialogue(
      customerId, title, description, publicTitle, leafs,
    ),
  );

  static createNewQuestionnaire = async (parent: any, args: any): Promise<Questionnaire> => {
    const { customerId, title, description, publicTitle, isSeed } = args;
    let questionnaire = null;

    if (isSeed) {
      const customer = await prisma.customer({ id: customerId });

      if (customer?.name) {
        return DialogueResolver.seedQuestionnare(customerId, customer?.name, title, description);
      }

      console.log('Cant find customer with specified ID while seeding');
    }

    questionnaire = await DialogueResolver.createDialogue(
      customerId, title, description, publicTitle,
    );

    return questionnaire;
  };

  static seedQuestionnare = async (
    customerId: string,
    customerName: string,
    questionnaireTitle: string = 'Default questionnaire',
    questionnaireDescription: string = 'Default questions',
  ): Promise<Questionnaire> => {
    const questionnaire = await DialogueResolver.createDialogue(
      customerId, questionnaireTitle, questionnaireDescription, '',
    );

    const leafs = await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

    await NodeResolver.createTemplateNodes(questionnaire.id, customerName, leafs);
    return questionnaire;
  };

  static getQuestionnaireAggregatedData = async (parent: any, args: any) => {
    const { topicId } = args;

    const customerName = (await prisma.questionnaire({ id: topicId }).customer()).name;
    const questionnaire: Questionnaire | null = (await prisma.questionnaire({ id: topicId }));

    if (questionnaire) {
      const { title, description, creationDate, updatedAt } = questionnaire;

      const questionNodes = await prisma.questionNodes({
        where: {
          questionnaire: {
            id: topicId,
          },
        },
      });

      const questionNodeIds = questionNodes.map((qNode) => qNode.id);

      const nodeEntries = await prisma.nodeEntries({
        where: {
          relatedNode: {
            id_in: questionNodeIds,
          },
        },
      }) || [];

      const aggregatedNodeEntries = await Promise.all(nodeEntries.map(async ({ id }) => {
        const values = await prisma.nodeEntry({ id }).values();
        const nodeEntry = await prisma.nodeEntry({ id });
        const sessionId = (await prisma.nodeEntry({ id }).session()).id;

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
