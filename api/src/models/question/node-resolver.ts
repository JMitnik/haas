import { Dialogue, Link, PrismaClient, QuestionCondition, QuestionNode, QuestionNodeCreateInput } from '@prisma/client';
import { multiChoiceType, sliderType } from '../../data/seeds/default-data';
import EdgeResolver from '../edge/edge-resolver';

const prisma = new PrismaClient();

interface LeafNodeDataEntryProps {
  title: string;
  type: string;
  links: Array<LinkGenericInputProps>
}

interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
}

interface EdgeChildProps {
  id?: string;
  conditions: [QuestionConditionProps];
  parentNode: EdgeNodeProps;
  childNode: EdgeNodeProps;
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

interface LeafNodeProps {
  id: string;
  nodeId?: string;
  type?: string;
  title: string;
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

interface LinkGenericInputProps {
  type: 'SOCIAL' | 'API' | 'FACEBOOK' | 'LINKEDIN' | 'WHATSAPP' | 'INSTAGRAM' | 'TWITTER';
  url: string;
}

interface LinkInputProps extends LinkGenericInputProps {
  id: string;
  title?: string;
  icon?: string;
  backgroundColor?: string;
}

const standardOptions = [{ value: 'Facilities' },
  { value: 'Website/Mobile app' },
  { value: 'Product/Services' },
  { value: 'Customer Support' }];

const facilityOptions = [{ value: 'Cleanliness' },
  { value: 'Atmosphere' },
  { value: 'Location' },
  { value: 'Other' }];

const websiteOptions = [{ value: 'Design' },
  { value: 'Functionality' },
  { value: 'Informative' },
  { value: 'Other' }];

const customerSupportOptions = [{ value: 'Friendliness' },
  { value: 'Competence' },
  { value: 'Speed' },
  { value: 'Other' }];

const productServicesOptions = [{ value: 'Quality' },
  { value: 'Price' },
  { value: 'Friendliness' },
  { value: 'Other' }];

class NodeResolver {
  static removeNonExistingLinks = async (
    dbLinks: Array<Link>,
    newLinks: Array<LinkInputProps>) => {
    const newLinkIds = newLinks?.map(({ id }) => id);
    const removeLinkIds = dbLinks?.filter(({ id }) => (!newLinkIds?.includes(id) && id)).map(({ id }) => id);
    if (removeLinkIds?.length > 0) {
      await prisma.link.deleteMany({ where: { id: { in: removeLinkIds } } });
    }
  };

  static upsertLinks = async (
    newLinks: Array<LinkInputProps>,
    questionId: string,
  ) => {
    newLinks?.forEach(async (link) => {
      await prisma.link.upsert({
        where: {
          id: link.id || '-1',
        },
        create: {
          title: link.title,
          url: link.url,
          type: link.type,
          backgroundColor: link.backgroundColor,
          iconUrl: link.icon,
          questionNode: {
            connect: {
              id: questionId,
            },
          },
        },
        update: {
          title: link.title,
          url: link.url,
          type: link.type,
          backgroundColor: link.backgroundColor,
          iconUrl: link.icon,
        },
      });
    });
  };

  static constructQuestionNode(title: string,
    questionnaireId: string,
    type: string,
    options: Array<any> = [],
    isRoot: boolean = false,
    overrideLeafId: string = '',
    isLeaf: boolean = false): QuestionNodeCreateInput {
    return {
      title,
      questionDialogue: {
        connect: {
          id: questionnaireId,
        },
      },
      overrideLeaf: overrideLeafId ? {
        connect: {
          id: overrideLeafId,
        },
      } : null,
      type,
      isRoot,
      isLeaf,
      options: {
        create: options.length > 0 ? [
          ...options,
        ] : [],
      },
    };
  }

  static createQuestionNode = async (
    title: string,
    questionnaireId: string,
    type: string,
    options: Array<any> = [],
    isRoot: boolean = false,
    overrideLeafId: string = '',
    isLeaf: boolean = false) => {
    const override = overrideLeafId ? {
      connect: {
        id: overrideLeafId,
      },
    } : null;

    const qOptions = options.length > 0 ? [
      ...options,
    ] : [];

    const params = override ? {
      title,
      questionDialogue: {
        connect: {
          id: questionnaireId,
        },
      },
      overrideLeaf: override,
      type,
      isRoot,
      isLeaf,
      options: {
        create: qOptions,
      },
    } : {
      title,
      questionDialogue: {
        connect: {
          id: questionnaireId,
        },
      },
      type,
      isRoot,
      isLeaf,
      options: {
        create: qOptions,
      },
    };

    return prisma.questionNode.create({
      data: params,
    });
  };

  static createTemplateLeafNodes = async (
    leafNodesArray: Array<LeafNodeDataEntryProps>, dialogueId: string) => {
    const leafs = await Promise.all(
      leafNodesArray.map(async ({ title, type, links }) => prisma.questionNode.create({
        data: {
          title,
          questionDialogue: {
            connect: {
              id: dialogueId,
            },
          },
          type,
          isRoot: false,
          isLeaf: true,
          links: {
            create: links,
          },
        },
      })),
    );
    return leafs;
  };

  static getCorrectLeaf = (leafs: QuestionNode[], titleSubset: string) => {
    const correctLeaf = leafs.find((leaf) => leaf.title.includes(titleSubset));
    return correctLeaf?.id;
  };

  static getLeafObject = (currentOverrideLeafId: string | undefined | null, overrideLeaf: any) => {
    if (overrideLeaf?.id) {
      return {
        connect: {
          id: overrideLeaf.id,
        },
      };
    }

    if (currentOverrideLeafId && !overrideLeaf?.id) {
      return { disconnect: true };
    }

    if (!currentOverrideLeafId && !overrideLeaf?.id) {
      return null;
    }

    return null;
  };

  static getLeafState = (currentOverrideLeafId: string | null, newOverrideLeafId: string) => {
    if (newOverrideLeafId) {
      return {
        connect: {
          id: newOverrideLeafId,
        },
      };
    }

    if (currentOverrideLeafId && !newOverrideLeafId) {
      return { disconnect: true };
    }

    if (!currentOverrideLeafId && !newOverrideLeafId) {
      return null;
    }

    return null;
  };

  static updateEdge = async (
    dbEdgeCondition: QuestionCondition,
    newEdgeCondition: {
      id: number | null,
      conditionType: string,
      renderMin: number | null,
      renderMax: number | null,
      matchValue: string | null
    },
  ) => prisma.questionCondition.update({
    where: {
      id: dbEdgeCondition.id || undefined,
    },
    data: {
      conditionType: newEdgeCondition.conditionType,
      matchValue: newEdgeCondition.matchValue,
      renderMin: newEdgeCondition.renderMin,
      renderMax: newEdgeCondition.renderMax,
    },
  });

  static getDeleteIDs = (
    edges: Array<{id: string, childNodeId: string, parentNodeId: string}>,
    questions: Array<{id: string}>, foundEdgeIds: Array<string>,
    foundQuestionIds: Array<string>,
  ): {edgeIds: Array<string>, questionIds: Array<string>} => {
    const newlyFoundEdgeIds: Array<string> = [];
    const newlyFoundQuestionIds: Array<string> = [];

    foundQuestionIds.forEach((id) => {
      const targetEdges = edges.filter((edge) => !foundEdgeIds.includes(edge.id) && id === edge.parentNodeId);
      if (!targetEdges.length) {
        return;
      }
      const edgeIds = targetEdges.map((edge) => edge.id);
      const questionIds = targetEdges.map(((edge) => edge.childNodeId));
      newlyFoundEdgeIds.push(...edgeIds);
      newlyFoundQuestionIds.push(...questionIds);
    });

    if (newlyFoundEdgeIds.length || newlyFoundQuestionIds.length) {
      return NodeResolver.getDeleteIDs(
        edges.filter((edge) => !foundEdgeIds.includes(edge.id)),
        questions.filter((question) => !foundQuestionIds.includes(question.id)),
        [...foundEdgeIds, ...newlyFoundEdgeIds],
        [...foundQuestionIds, ...newlyFoundQuestionIds],
      );
    }
    return { edgeIds: foundEdgeIds, questionIds: foundQuestionIds };
  };

  static deleteQuestionFromBuilder = async (id: string, dialogue: Dialogue & {
    questions: {
      id: string;
    }[];
    edges: {
      id: string;
      parentNodeId: string;
      childNodeId: string;
    }[];
  }) => {
    const { questions, edges } = dialogue;
    const foundEdgeIds: Array<string> = [];
    const foundQuestionIds: Array<string> = [id];
    const edgeToDeleteQuestion = edges.find((edge) => edge.childNodeId === id);

    if (edgeToDeleteQuestion) {
      foundEdgeIds.push(edgeToDeleteQuestion.id);
    }

    const { edgeIds, questionIds } = NodeResolver.getDeleteIDs(edges, questions, foundEdgeIds, foundQuestionIds);
    await prisma.edge.deleteMany({
      where: {
        id: {
          in: edgeIds,
        },
      },
    });

    await prisma.questionNode.deleteMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    const questionToDelete = questions.find((question) => id === question.id);
    return questionToDelete;
  };

  static createQuestionFromBuilder = async (
    dialogueId: string,
    title: string,
    type: string,
    overrideLeafId: string,
    parentQuestionId: string,
    options: Array<QuestionOptionProps>,
    edgeCondition: {
      id: number | null,
      conditionType: string,
      renderMin: number | null,
      renderMax: number | null,
      matchValue: string | null
    },
  ) => {
    const leaf = overrideLeafId !== 'None' ? { connect: { id: overrideLeafId } } : null;
    const newQuestion = await prisma.questionNode.create({
      data: {
        title,
        type,
        overrideLeaf: leaf,
        options: {
          create: options.map((option) => ({
            value: option.value,
            publicValue: option.publicValue,
          })),
        },
        questionDialogue: {
          connect: {
            id: dialogueId,
          },
        },
      },
    });

    await prisma.edge.create({
      data: {
        dialogue: {
          connect: {
            id: dialogueId,
          },
        },
        parentNode: {
          connect: {
            id: parentQuestionId,
          },
        },
        conditions: {
          create: {
            renderMin: edgeCondition.renderMin,
            renderMax: edgeCondition.renderMax,
            matchValue: edgeCondition.matchValue,
            conditionType: edgeCondition.conditionType,
          },
        },
        childNode: {
          connect: {
            id: newQuestion.id,
          },
        },
      },
    });
    return newQuestion;
  };

  static updateQuestionFromBuilder = async (
    questionId: string,
    title: string,
    type: string,
    overrideLeafId: string,
    edgeId: string,
    options: Array<QuestionOptionProps>,
    edgeCondition: {
      id: number | null,
      conditionType: string,
      renderMin: number | null,
      renderMax: number | null,
      matchValue: string | null
    },
  ) => {
    const activeQuestion = await prisma.questionNode.findOne({ where: { id: questionId },
      include: {
        children: true,
        options: true,
        questionDialogue: {
          select: {
            id: true,
          },
        },
        overrideLeaf: {
          select: {
            id: true,
          },
        },
      } });

    const dbEdge = await prisma.edge.findOne({
      where: {
        id: edgeId,
      },
      include: {
        conditions: true,
      },
    });

    const activeOptions = activeQuestion ? activeQuestion?.options?.map((option) => option.id) : [];
    const currentOverrideLeafId = activeQuestion?.overrideLeafId || null;
    const leaf = NodeResolver.getLeafState(currentOverrideLeafId, overrideLeafId);

    const dbEdgeCondition = dbEdge?.conditions && dbEdge.conditions[0];

    try {
      await NodeResolver.removeNonExistingQOptions(activeOptions, options, questionId);
    } catch (e) {
      console.log('Something went wrong removing options: ', e);
    }
    try {
      if (dbEdgeCondition) {
        await NodeResolver.updateEdge(dbEdgeCondition, edgeCondition);
      } else {
        throw Error;
      }
    } catch (e) {
      console.log('something went wrong updating edges: ', e);
    }

    const updatedOptionIds = await NodeResolver.updateQuestionOptions(options);
    return leaf ? prisma.questionNode.update({
      where: { id: questionId },
      data: {
        title,
        overrideLeaf: leaf,
        type,
        options: {
          connect: updatedOptionIds,
        },
      },
    }) : prisma.questionNode.update({
      where: { id: questionId },
      data: {
        title,
        type,
        options: {
          connect: updatedOptionIds,
        },
      },
    });
  };

  static updateQuestionOptions = async (options: Array<QuestionOptionProps>) => Promise.all(
    options?.map(async (option) => {
      const updatedQOption = await prisma.questionOption.upsert(
        {
          where: { id: option.id ? option.id : -1 },
          create: {
            value: option.value,
            publicValue: option.publicValue,
          },
          update: {
            value: option.value,
            publicValue: option.publicValue,
          },
        },
      );
      return { id: updatedQOption.id };
    }),
  );

  static updateNewQConditions = async (edge: EdgeChildProps) => {
    const { conditionType, renderMax, renderMin, matchValue } = edge.conditions[0];
    const condition = await prisma.questionCondition.upsert(
      {
        where:
        {
          id: edge?.conditions?.[0]?.id ? edge?.conditions?.[0]?.id : -1,
        },
        create: {
          conditionType,
          renderMax,
          renderMin,
          matchValue,
        },
        update: {
          conditionType,
          renderMax,
          renderMin,
          matchValue,
        },
      },
    );
    return { id: condition.id };
  };

  static removeNonExistingQOptions = async (
    activeOptions: Array<number>,
    newOptions: Array<QuestionOptionProps>,
    questionId: string) => {
    if (questionId) {
      const newOptioIds = newOptions?.map(({ id }) => id);
      const removeQOptionsIds = activeOptions?.filter((id) => (!newOptioIds.includes(id) && id));
      if (removeQOptionsIds?.length > 0) {
        await prisma.questionOption.deleteMany({ where: { id: { in: removeQOptionsIds } } });
      }
    }
  };

  static createTemplateNodes = async (
    questionnaireId: string,
    customerName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await NodeResolver.createQuestionNode(`How do you feel about ${customerName}?`, questionnaireId, sliderType, standardOptions, true);

    // Positive Sub child 1 (What did you like?)
    const instagramNodeId = NodeResolver.getCorrectLeaf(leafs, 'Follow us on Instagram and stay');
    const rootToWhatDidYou = await NodeResolver.createQuestionNode(
      'What did you like?', questionnaireId, multiChoiceType, standardOptions, false,
      instagramNodeId,
    );

    // Positive Sub sub child 1 (Facilities)
    const comeAndJoin1stAprilId = NodeResolver.getCorrectLeaf(leafs,
      'Come and join us on 1st April for our great event');
    const whatDidYouToFacilities = await NodeResolver.createQuestionNode(
      'What exactly did you like about the facilities?', questionnaireId,
      multiChoiceType, facilityOptions, false, comeAndJoin1stAprilId,
    );

    // Positive Sub sub child 2 (Website)
    const whatDidYouToWebsite = await NodeResolver.createQuestionNode(
      'What exactly did you like about the website?', questionnaireId,
      multiChoiceType, websiteOptions, false, instagramNodeId,
    );

    // Positive Sub sub child 3 (Product/Services)
    const weThinkYouMightLikeThis = NodeResolver.getCorrectLeaf(leafs,
      'We think you might like this as');
    const whatDidYouToProduct = await NodeResolver.createQuestionNode(
      'What exactly did you like about the product / services?', questionnaireId,
      multiChoiceType, productServicesOptions, false, weThinkYouMightLikeThis,
    );

    // Positive Sub sub child 4 (Customer Support)
    const yourEmailBelowForNewsletter = NodeResolver.getCorrectLeaf(leafs,
      'your email below to receive our newsletter');
    const whatDidYouToCustomerSupport = await NodeResolver.createQuestionNode(
      'What exactly did you like about the customer support?', questionnaireId,
      multiChoiceType, customerSupportOptions, false, yourEmailBelowForNewsletter,
    );

    // Neutral Sub child 2
    const leaveYourEmailBelowToReceive = NodeResolver.getCorrectLeaf(leafs,
      'Leave your email below to receive our');
    const rootToWhatWouldYouLikeToTalkAbout = await NodeResolver.createQuestionNode(
      'What would you like to talk about?', questionnaireId, multiChoiceType,
      standardOptions, false, leaveYourEmailBelowToReceive,
    );

    // Neutral Sub sub child 1 (Facilities)
    const whatWouldYouLikeToTalkAboutToFacilities = await NodeResolver.createQuestionNode('Please specify.',
      questionnaireId, multiChoiceType, facilityOptions);

    // Neutral Sub sub child 2 (Website)
    const whatWouldYouLikeToTalkAboutToWebsite = await NodeResolver.createQuestionNode(
      'Please specify.', questionnaireId, multiChoiceType, websiteOptions,
    );

    // Neutral Sub sub child 3 (Product/Services)
    const whatWouldYouLikeToTalkAboutToProduct = await NodeResolver.createQuestionNode(
      'Please specify.', questionnaireId, multiChoiceType, productServicesOptions,
    );

    // Neutral Sub sub child 4 (Customer Support)
    const whatWouldYouLikeToTalkAboutToCustomerSupport = await NodeResolver.createQuestionNode(
      'Please specify.', questionnaireId, multiChoiceType, customerSupportOptions,
    );

    // Negative Sub child 3
    const rootToWeAreSorryToHearThat = await NodeResolver.createQuestionNode(
      'We are sorry to hear that! Where can we improve?', questionnaireId,
      multiChoiceType, standardOptions,
    );

    // Negative Sub sub child 1 (Facilities)
    const ourTeamIsOnIt = NodeResolver.getCorrectLeaf(leafs, 'Our team is on it');
    const weAreSorryToHearThatToFacilities = await NodeResolver.createQuestionNode(
      'Please elaborate.', questionnaireId, multiChoiceType, facilityOptions, false, ourTeamIsOnIt,
    );

    // Negative Sub sub child 2 (Website)
    const pleaseClickWhatsappLink = NodeResolver.getCorrectLeaf(leafs,
      'Please click on the Whatsapp link below so our service');
    const weAreSorryToHearThatToWebsite = await NodeResolver.createQuestionNode(
      'Please elaborate.', questionnaireId, multiChoiceType, websiteOptions,
      false, pleaseClickWhatsappLink,
    );

    // Negative Sub sub child 3 (Product/Services)
    const clickBelowForRefund = NodeResolver.getCorrectLeaf(leafs, 'Click below for your refund');
    const weAreSorryToHearThatToProduct = await NodeResolver.createQuestionNode(
      'Please elaborate.', questionnaireId, multiChoiceType, productServicesOptions,
      false, clickBelowForRefund,
    );

    // Negative Sub sub child 4 (Customer Support)
    const ourCustomerExperienceSupervisor = NodeResolver.getCorrectLeaf(leafs,
      'Our customer experience supervisor is');
    const weAreSorryToHearThatToCustomerSupport = await NodeResolver.createQuestionNode(
      'Please elaborate', questionnaireId, multiChoiceType, customerSupportOptions,
      false, ourCustomerExperienceSupervisor,
    );

    // ################################### EDGES ################################

    // Positive edges
    await EdgeResolver.createEdge(rootQuestion, rootToWhatDidYou,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    await EdgeResolver.createEdge(rootToWhatDidYou, whatDidYouToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await EdgeResolver.createEdge(rootToWhatDidYou, whatDidYouToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      });

    await EdgeResolver.createEdge(rootToWhatDidYou, whatDidYouToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMin: null, renderMax: null });

    await EdgeResolver.createEdge(rootToWhatDidYou, whatDidYouToCustomerSupport,
      { conditionType: 'match', matchValue: 'Customer Support', renderMin: null, renderMax: null });

    // Neutral edges
    await EdgeResolver.createEdge(rootQuestion, rootToWhatWouldYouLikeToTalkAbout,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 50, renderMax: 70 });

    await EdgeResolver.createEdge(rootToWhatWouldYouLikeToTalkAbout, whatWouldYouLikeToTalkAboutToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await EdgeResolver.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      });

    await EdgeResolver.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToProduct, {
        conditionType: 'match',
        matchValue: 'Product/Services',
        renderMin: null,
        renderMax: null,
      });

    await EdgeResolver.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToCustomerSupport, {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      });

    // Negative edges
    await EdgeResolver.createEdge(rootQuestion, rootToWeAreSorryToHearThat,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 50 });

    await EdgeResolver.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMax: null, renderMin: null });

    await EdgeResolver.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMax: null,
        renderMin: null,
      });

    await EdgeResolver.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMax: null, renderMin: null });

    await EdgeResolver.createEdge(rootToWeAreSorryToHearThat,
      weAreSorryToHearThatToCustomerSupport, {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMax: null,
        renderMin: null,
      });
  };
}

export default NodeResolver;
