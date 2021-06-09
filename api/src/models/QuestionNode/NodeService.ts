import { Dialogue, FormNodeCreateInput, Link, NodeType, QuestionCondition, QuestionNode, QuestionNodeCreateInput, VideoEmbeddedNodeCreateOneWithoutQuestionNodeInput, VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput, PrismaClient, FormNodeFieldUpsertArgs } from '@prisma/client';
import { NexusGenInputs } from '../../generated/nexus';
import EdgeService from '../edge/EdgeService';
import prisma from '../../config/prisma';
import { NodeServiceType, QuestionOptionProps } from './NodeServiceType';
import { QuestionNodePrismaAdapterType } from './adapters/QuestionNode/QuestionNodePrismaAdapterType';
import QuestionNodePrismaAdapter from './adapters/QuestionNode/QuestionNodePrismaAdapter';
import { EdgeServiceType } from '../edge/EdgeServiceType';
import { LinkPrismaAdapterType } from '../link/LinkPrismaAdapterType';
import LinkPrismaAdapter from '../link/LinkPrismaAdapter';
import { findDifference } from '../../utils/findDifference';
import { ShareNodePrismaAdapterType } from './adapters/ShareNode/ShareNodePrismaAdapterType';
import ShareNodePrismaAdapter from './adapters/ShareNode/ShareNodePrismaAdapter';
import { QuestionConditionPrismaAdapterType } from './adapters/QuestionCondition/QuestionConditionPrismaAdapterType';
import QuestionConditionPrismaAdapter from './adapters/QuestionCondition/QuestionConditionPrismaAdapter';
import { VideoNodePrismaAdapterType } from './adapters/VideoNode/VideoNodePrismaAdapterType';
import VideoNodePrismaAdapter from './adapters/VideoNode/VideoNodePrismaAdapter';

interface LeafNodeDataEntryProps {
  title: string;
  type: NodeType;
  links: LinkGenericInputProps[];
  form?: NexusGenInputs['FormNodeInputType'];
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

interface LinkGenericInputProps {
  type: 'SOCIAL' | 'API' | 'FACEBOOK' | 'LINKEDIN' | 'WHATSAPP' | 'INSTAGRAM' | 'TWITTER';
  url: string;
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

class NodeService implements NodeServiceType {
  prisma: PrismaClient;
  questionNodePrismaAdapter: QuestionNodePrismaAdapterType;
  edgeService: EdgeServiceType;
  linkPrismaAdapter: LinkPrismaAdapterType;
  shareNodePrismaAdapter: ShareNodePrismaAdapterType;
  questionConditionAdapter: QuestionConditionPrismaAdapterType;
  videoNodePrismaAdapter: VideoNodePrismaAdapterType;

  constructor(prismaClient: PrismaClient) {
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.linkPrismaAdapter = new LinkPrismaAdapter(prismaClient);
    this.shareNodePrismaAdapter = new ShareNodePrismaAdapter(prismaClient);
    this.questionConditionAdapter = new QuestionConditionPrismaAdapter(prismaClient);
    this.videoNodePrismaAdapter = new VideoNodePrismaAdapter(prismaClient);
    this.prisma = prismaClient;
  }

  saveEditFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): FormNodeFieldUpsertArgs[] | undefined => (
    input.fields?.map((field) => ({
      create: {
        type: field.type || 'shortText',
        label: field.label || 'Generic',
        position: field.position || -1,
        isRequired: field.isRequired || false,
      },
      update: {
        type: field.type || 'shortText',
        label: field.label || 'Generic',
        position: field.position || -1,
        isRequired: field.isRequired || false,
      },
      where: {
        id: field.id || '-1',
      },
    })) || undefined
  );

  async updateCTA(input: NexusGenInputs['UpdateCTAInputType']) {
    if (!input.id) {
      throw new Error('No ID Found');
    }

    const existingNode = await this.questionNodePrismaAdapter.getCTANode(input.id);

    // If a share was previously on the node, but not any longer the case, disconnect it.
    if (existingNode?.share && (!input?.share || input?.type !== 'SHARE')) {
      await this.shareNodePrismaAdapter.delete(existingNode.share.id);
    }

    // If type is share, create a share connection (or update it)
    if (input?.share && input?.share.id && input?.type === 'SHARE') {
      await this.shareNodePrismaAdapter.upsert(input?.share.id, {
        title: input?.share.title || '',
        url: input?.share.url || '',
        tooltip: input?.share.tooltip,
        questionNode: {
          connect: {
            id: existingNode?.id,
          },
        },
      },
        {
          title: input?.share.title || '',
          url: input?.share.url || '',
          tooltip: input?.share.tooltip,
        },
      )
    }

    // If we have links associated, remove "non-existing links"
    if (existingNode?.links && input?.links?.linkTypes?.length) {
      await this.removeNonExistingLinks(existingNode?.links, input?.links?.linkTypes);
    }

    // Upsert links in g eneral
    if (input?.links?.linkTypes?.length) {
      await this.upsertLinks(input?.links?.linkTypes, input?.id);
    }

    // If form is passed
    if (input?.form && input.id) {
      const removedFields = findDifference(existingNode?.form?.fields, input?.form?.fields);

      if (removedFields.length) {
        await this.questionNodePrismaAdapter.update(input.id, {
          form: {
            update: {
              fields: {
                disconnect: removedFields.map((field) => ({ id: field?.id?.toString() || '' })),
              },
            },
          },
        });
      }

      if (existingNode?.form) {
        await this.questionNodePrismaAdapter.update(input.id, {
          form: {
            update: {
              fields: {
                upsert: this.saveEditFormNodeInput(input.form),
              },
            },
          },
        });
      } else {
        await this.questionNodePrismaAdapter.update(input?.id, {
          form: {
            create: NodeService.saveCreateFormNodeInput(input.form),
          },
        });
      };
    };

    // Finally, update question-node
    return this.questionNodePrismaAdapter.update(input.id, {
      title: input?.title || '',
      type: input.type || 'GENERIC',
    });
  };

  getNodeByLinkId(linkId: string) {
    return this.questionNodePrismaAdapter.getNodeByLinkId(linkId);
  }

  getNodeById(parentNodeId: string) {
    return this.questionNodePrismaAdapter.getNodeById(parentNodeId);
  }

  removeNonExistingLinks = async (
    existingLinks: Array<Link>,
    newLinks: NexusGenInputs['CTALinkInputObjectType'][],
  ) => {
    const newLinkIds = newLinks?.map(({ id }) => id);
    const removeLinkIds = existingLinks?.filter(({ id }) => (!newLinkIds?.includes(id) && id)).map(({ id }) => id);

    if (removeLinkIds?.length > 0) {
      await this.linkPrismaAdapter.deleteMany(removeLinkIds);
    }
  };

  /**
   * Save FormNodeInput when `creating`
   */
  static saveCreateFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): FormNodeCreateInput => ({
    fields: {
      create: input.fields?.map((field) => ({
        type: field.type || 'shortText',
        label: field.label || 'Generic',
        position: field.position || -1,
        isRequired: field.isRequired || false,
      })),
    },
  });

  upsertLinks = async (
    newLinks: NexusGenInputs['CTALinkInputObjectType'][],
    questionId: string,
  ) => {
    newLinks?.forEach(async (link) => {
      await this.linkPrismaAdapter.upsert(link.id, {
        title: link.title,
        url: link.url || '',
        type: link.type || 'API',
        backgroundColor: link.backgroundColor,
        iconUrl: link.iconUrl || '',
        questionNode: {
          connect: {
            id: questionId,
          },
        },
      },
        {
          title: link.title,
          url: link.url || '',
          type: link.type || 'API',
          backgroundColor: link.backgroundColor,
          iconUrl: link.iconUrl || '',
        },
      )
    });
  };

  static constructQuestionNode(title: string,
    questionnaireId: string,
    type: NodeType,
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
      } : undefined,
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

  createQuestionNode = async (
    title: string,
    questionnaireId: string,
    type: NodeType,
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

    const params: QuestionNodeCreateInput = override ? {
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

    return this.questionNodePrismaAdapter.create(params);
  };

  createTemplateLeafNodes = async (
    leafNodesArray: LeafNodeDataEntryProps[],
    dialogueId: string,
  ) => {
    // Make leafs based on array
    const leafs = await Promise.all(
      leafNodesArray.map(async ({ title, type, links, form }) => this.questionNodePrismaAdapter.create({
        title,
        questionDialogue: { connect: { id: dialogueId } },
        type,
        isRoot: false,
        isLeaf: true,
        links: links.length ? {
          create: links,
        } : undefined,
        form: {
          create: form?.fields ? {
            fields: {
              create: form?.fields?.length > 0 ? form.fields.map((field) => ({
                label: field.label || '',
                position: field.position || -1,
                isRequired: field.isRequired || false,
                type: field.type || 'shortText',
              })) : undefined,
            },
          } : undefined,
        },
      }))
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

  static getLeafState = (currentOverrideLeafId: string | null, newOverrideLeafId: string | null) => {
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

  updateEdge = async (
    dbEdgeCondition: QuestionCondition,
    newEdgeCondition: {
      id: number | null,
      conditionType: string,
      renderMin: number | null,
      renderMax: number | null,
      matchValue: string | null
    },
  ) => this.questionConditionAdapter.update(dbEdgeCondition.id, {
    conditionType: newEdgeCondition.conditionType,
    matchValue: newEdgeCondition.matchValue,
    renderMin: newEdgeCondition.renderMin,
    renderMax: newEdgeCondition.renderMax,
  });

  static getDeleteIDs = (
    edges: Array<{ id: string, childNodeId: string, parentNodeId: string }>,
    questions: Array<{ id: string }>, foundEdgeIds: Array<string>,
    foundQuestionIds: Array<string>,
  ): { edgeIds: Array<string>, questionIds: Array<string> } => {
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
      return NodeService.getDeleteIDs(
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

    const { edgeIds, questionIds } = NodeService.getDeleteIDs(edges, questions, foundEdgeIds, foundQuestionIds);
    await prisma.edge.deleteMany({
      where: {
        id: {
          in: edgeIds,
        },
      },
    });

    const deletedQuestion = await prisma.questionNode.findOne({
      where: {
        id,
      }
    })

    await prisma.share.deleteMany({
      where: {
        questionNodeId: id,
      },
    });

    if (deletedQuestion?.videoEmbeddedNodeId) {
      await prisma.videoEmbeddedNode.delete({
        where: {
          id: deletedQuestion?.videoEmbeddedNodeId,
        }
      })
    }


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
    type: NodeType,
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
    extraContent: string | null,
  ) => {
    const leaf = overrideLeafId !== 'None' ? { connect: { id: overrideLeafId } } : null;
    const videoEmbeddedNode: VideoEmbeddedNodeCreateOneWithoutQuestionNodeInput | undefined = extraContent ? { create: { videoUrl: extraContent } } : undefined;
    const newQuestion = await prisma.questionNode.create({
      data: {
        title,
        type,
        videoEmbeddedNode,
        overrideLeaf: leaf || undefined,
        options: {
          create: options.map((option) => ({
            value: option.value,
            publicValue: option.publicValue,
            overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined
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

  updateQuestionFromBuilder = async (
    questionId: string,
    title: string,
    type: NodeType,
    overrideLeafId: string | null,
    edgeId: string | undefined,
    options: QuestionOptionProps[],
    edgeCondition: {
      id: number | null,
      conditionType: string,
      renderMin: number | null,
      renderMax: number | null,
      matchValue: string | null
    },
    sliderNode: NexusGenInputs['SliderNodeInputType'],
    extraContent: string | null | undefined,
  ) => {
    const activeQuestion = await this.questionNodePrismaAdapter.getDialogueBuilderNode(questionId);

    const dbEdge = await this.edgeService.getEdgeById(edgeId || '-1');

    const activeOptions = activeQuestion ? activeQuestion?.options?.map((option) => option.id) : [];
    const currentOverrideLeafId = activeQuestion?.overrideLeafId || null;
    const leaf = NodeService.getLeafState(currentOverrideLeafId, overrideLeafId);

    const dbEdgeCondition = dbEdge?.conditions && dbEdge.conditions[0];


    try {
      await NodeService.removeNonExistingQOptions(activeOptions, options, questionId);
    } catch (e) {
      console.log('Something went wrong removing options: ', e);
    }

    // Updating any question except root question should have this edge
    if (dbEdgeCondition) {
      try {
        await this.updateEdge(dbEdgeCondition, edgeCondition);
      } catch (e) {
        console.log('something went wrong updating edges: ', e.stack);
      }
    }

    const updatedOptionIds = await NodeService.updateQuestionOptions(options);

    // Remove videoEmbeddedNode if updated to different type
    let embedVideoInput: VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput | undefined;
    if (activeQuestion?.type !== NodeType.VIDEO_EMBEDDED && activeQuestion?.videoEmbeddedNodeId) {
      embedVideoInput = { delete: true };
    }

    const updatedNode = leaf ? await this.questionNodePrismaAdapter.updateDialogueBuilderNode(questionId, {
      videoEmbeddedNode: embedVideoInput,
      title,
      overrideLeaf: leaf,
      type,
      options: {
        connect: updatedOptionIds,
      },
    }) : await this.questionNodePrismaAdapter.updateDialogueBuilderNode(questionId, {
      videoEmbeddedNode: embedVideoInput,
      title,
      type,
      options: {
        connect: updatedOptionIds,
      },
    })

    if (type === NodeType.VIDEO_EMBEDDED) {
      if (updatedNode?.videoEmbeddedNodeId) {
        await this.videoNodePrismaAdapter.update(updatedNode.videoEmbeddedNodeId, {
          videoUrl: extraContent,
        });
      } else {
        await this.videoNodePrismaAdapter.create({
          videoUrl: extraContent,
          QuestionNode: {
            connect: { id: questionId },
          },
        })
      }
    } else if (type === NodeType.SLIDER) {
      if (updatedNode?.sliderNodeId) {
        await prisma.sliderNode.update({
          where: { id: updatedNode.sliderNodeId },
          data: {
            markers: {
              update: sliderNode?.markers?.map((marker) => ({
                where: { id: marker?.id || undefined },
                data: {
                  label: marker.label,
                  subLabel: marker.subLabel,
                },
              })),
            },
          },
        });
      } else {
        await prisma.sliderNode.create({
          data: {
            QuestionNode: {
              connect: { id: questionId },
            },
            markers: {
              create: sliderNode?.markers?.map((marker) => ({
                label: marker.label || '',
                subLabel: marker.subLabel || '',
                range: {
                  create: {
                    start: marker?.range?.start || undefined,
                    end: marker?.range?.end || undefined,
                  },
                },
              })),
            },
          },
        });
      }
    }

    return updatedNode;
  };

  static updateQuestionOptions = async (options: QuestionOptionProps[]) => Promise.all(
    options?.map(async (option) => {
      const updatedQOption = await prisma.questionOption.upsert(
        {
          where: { id: option.id ? option.id : -1 },
          create: {
            value: option.value,
            publicValue: option.publicValue,
            overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined
          },
          update: {
            value: option.value,
            publicValue: option.publicValue,
            overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined
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

  createTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.createQuestionNode(
      `How do you feel about ${workspaceName}?`,
      dialogueId, NodeType.SLIDER, standardOptions, true,
    );

    // Positive Sub child 1 (What did you like?)
    const instagramNodeId = NodeService.getCorrectLeaf(leafs, 'Follow us on Instagram and stay');
    const rootToWhatDidYou = await this.createQuestionNode(
      'What did you like?', dialogueId, NodeType.CHOICE, standardOptions, false,
      instagramNodeId,
    );

    // Positive Sub sub child 1 (Facilities)
    const comeAndJoin1stAprilId = NodeService.getCorrectLeaf(leafs,
      'Come and join us on 1st April for our great event');
    const whatDidYouToFacilities = await this.createQuestionNode(
      'What exactly did you like about the facilities?', dialogueId,
      NodeType.CHOICE, facilityOptions, false, comeAndJoin1stAprilId,
    );

    // Positive Sub sub child 2 (Website)
    const whatDidYouToWebsite = await this.createQuestionNode(
      'What exactly did you like about the website?', dialogueId,
      NodeType.CHOICE, websiteOptions, false, instagramNodeId,
    );

    // Positive Sub sub child 3 (Product/Services)
    const weThinkYouMightLikeThis = NodeService.getCorrectLeaf(
      leafs,
      'We think you might like this as',
    );

    const whatDidYouToProduct = await this.createQuestionNode(
      'What exactly did you like about the product / services?',
      dialogueId,
      NodeType.CHOICE,
      productServicesOptions,
      false,
      weThinkYouMightLikeThis,
    );

    // Positive Sub sub child 4 (Customer Support)
    const yourEmailBelowForNewsletter = NodeService.getCorrectLeaf(leafs,
      'your email below to receive our newsletter');
    const whatDidYouToCustomerSupport = await this.createQuestionNode(
      'What exactly did you like about the customer support?', dialogueId,
      NodeType.CHOICE, customerSupportOptions, false, yourEmailBelowForNewsletter,
    );

    // Neutral Sub child 2
    const leaveYourEmailBelowToReceive = NodeService.getCorrectLeaf(leafs,
      'Leave your email below to receive our');
    const rootToWhatWouldYouLikeToTalkAbout = await this.createQuestionNode(
      'What would you like to talk about?', dialogueId, NodeType.CHOICE,
      standardOptions, false, leaveYourEmailBelowToReceive,
    );

    // Neutral Sub sub child 1 (Facilities)
    const whatWouldYouLikeToTalkAboutToFacilities = await this.createQuestionNode('Please specify.',
      dialogueId, NodeType.CHOICE, facilityOptions);

    // Neutral Sub sub child 2 (Website)
    const whatWouldYouLikeToTalkAboutToWebsite = await this.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, websiteOptions,
    );

    // Neutral Sub sub child 3 (Product/Services)
    const whatWouldYouLikeToTalkAboutToProduct = await this.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, productServicesOptions,
    );

    // Neutral Sub sub child 4 (Customer Support)
    const whatWouldYouLikeToTalkAboutToCustomerSupport = await this.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, customerSupportOptions,
    );

    // Negative Sub child 3
    const rootToWeAreSorryToHearThat = await this.createQuestionNode(
      'We are sorry to hear that! Where can we improve?', dialogueId,
      NodeType.CHOICE, standardOptions,
    );

    // Negative Sub sub child 1 (Facilities)
    const ourTeamIsOnIt = NodeService.getCorrectLeaf(leafs, 'Our team is on it');
    const weAreSorryToHearThatToFacilities = await this.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, facilityOptions, false, ourTeamIsOnIt,
    );

    // Negative Sub sub child 2 (Website)
    const pleaseClickWhatsappLink = NodeService.getCorrectLeaf(leafs,
      'Please click on the Whatsapp link below so our service');
    const weAreSorryToHearThatToWebsite = await this.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, websiteOptions,
      false, pleaseClickWhatsappLink,
    );

    // Negative Sub sub child 3 (Product/Services)
    const clickBelowForRefund = NodeService.getCorrectLeaf(leafs, 'Click below for your refund');
    const weAreSorryToHearThatToProduct = await this.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, productServicesOptions,
      false, clickBelowForRefund,
    );

    // Negative Sub sub child 4 (Customer Support)
    const ourCustomerExperienceSupervisor = NodeService.getCorrectLeaf(leafs,
      'Our customer experience supervisor is');
    const weAreSorryToHearThatToCustomerSupport = await this.createQuestionNode(
      'Please elaborate', dialogueId, NodeType.CHOICE, customerSupportOptions,
      false, ourCustomerExperienceSupervisor,
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, rootToWhatDidYou,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    await this.edgeService.createEdge(rootToWhatDidYou, whatDidYouToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(rootToWhatDidYou, whatDidYouToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      });

    await this.edgeService.createEdge(rootToWhatDidYou, whatDidYouToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(rootToWhatDidYou, whatDidYouToCustomerSupport,
      { conditionType: 'match', matchValue: 'Customer Support', renderMin: null, renderMax: null });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, rootToWhatWouldYouLikeToTalkAbout,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 50, renderMax: 70 });

    await this.edgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout, whatWouldYouLikeToTalkAboutToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      });

    await this.edgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToProduct, {
      conditionType: 'match',
      matchValue: 'Product/Services',
      renderMin: null,
      renderMax: null,
    });

    await this.edgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToCustomerSupport, {
      conditionType: 'match',
      matchValue: 'Customer Support',
      renderMin: null,
      renderMax: null,
    });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, rootToWeAreSorryToHearThat,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 50 });

    await this.edgeService.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMax: null, renderMin: null });

    await this.edgeService.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMax: null,
        renderMin: null,
      });

    await this.edgeService.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMax: null, renderMin: null });

    await this.edgeService.createEdge(rootToWeAreSorryToHearThat,
      weAreSorryToHearThatToCustomerSupport, {
      conditionType: 'match',
      matchValue: 'Customer Support',
      renderMax: null,
      renderMin: null,
    });
  };
}

export default NodeService;
