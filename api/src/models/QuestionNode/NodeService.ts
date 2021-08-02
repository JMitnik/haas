import { Dialogue, Edge, EdgeCreateWithoutDialogueInput, Enumerable, FormNodeCreateInput, Link, NodeType, QuestionCondition, QuestionNode, QuestionNodeCreateInput, QuestionOption, QuestionOptionCreateManyWithoutQuestionNodeInput, VideoEmbeddedNode, VideoEmbeddedNodeCreateOneWithoutQuestionNodeInput, VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput } from '@prisma/client';
import { NexusGenInputs } from '../../generated/nexus';
import EdgeService from '../edge/EdgeService';
import prisma from '../../config/prisma';
import cuid from 'cuid';

interface LeafNodeDataEntryProps {
  title: string;
  type: NodeType;
  links: LinkGenericInputProps[];
  form?: NexusGenInputs['FormNodeInputType'];
};

interface QuestionOptionProps {
  id?: number;
  value: string;
  publicValue?: string;
  overrideLeafId?: string;
  position: number;
};

interface EdgeChildProps {
  id?: string;
  conditions: [QuestionConditionProps];
  parentNode: EdgeNodeProps;
  childNode: EdgeNodeProps;
};

interface QuestionConditionProps {
  id?: number;
  conditionType: string;
  renderMin: number;
  renderMax: number;
  matchValue: string;
};

interface EdgeNodeProps {
  id: string;
  title: string;
};

interface LinkGenericInputProps {
  type: 'SOCIAL' | 'API' | 'FACEBOOK' | 'LINKEDIN' | 'WHATSAPP' | 'INSTAGRAM' | 'TWITTER';
  url: string;
};

const standardOptions = [
  { value: 'Facilities', position: 1 },
  { value: 'Website/Mobile app', position: 2 },
  { value: 'Product/Services', position: 3 },
  { value: 'Customer Support', position: 4 }
];

const facilityOptions = [
  { value: 'Cleanliness', position: 1 },
  { value: 'Atmosphere', position: 2 },
  { value: 'Location', position: 3 },
  { value: 'Other', position: 4 }
];

const websiteOptions = [
  { value: 'Design', position: 1 },
  { value: 'Functionality', position: 2 },
  { value: 'Informative', position: 3 },
  { value: 'Other', position: 4 }
];

const customerSupportOptions = [
  { value: 'Friendliness', position: 1 },
  { value: 'Competence', position: 2 },
  { value: 'Speed', position: 3 },
  { value: 'Other', position: 4 }
];

const productServicesOptions = [
  { value: 'Quality', position: 1 },
  { value: 'Price', position: 2 },
  { value: 'Friendliness', position: 3 },
  { value: 'Other', position: 4 }
];

export interface IdMapProps {
  [details: string]: string;
}

class NodeService {
  /**
   * Creates a key-value pair of an existing CUID (e.g. questionId or edgeId) and a newly generate CUID
   * @param ids An array of existing CUIDs
   */
  static createCuidPairs = (idMap: IdMapProps, ids: string[]) => {
    ids.forEach((oldId) => {
      if (!Object.keys(idMap).find((id) => id === oldId)) {
        idMap[oldId] = cuid();
      }
    });
  }

  /**
   * Recursively get ids of all edges and questions.
   * */
  static getNestedBranchIds = (edges: Edge[], edgeIds: string[], questionIds: string[], questionId: string) => {
    const targetEdges = edges.filter((edge) => edge.parentNodeId === questionId);
    if (targetEdges.length) {
      targetEdges.forEach((targetEdge) => {
        const childQuestionNodeId = targetEdge?.childNodeId;
        const edgeId = targetEdge.id

        edgeIds.push(edgeId);
        questionIds.push(childQuestionNodeId);

        NodeService.getNestedBranchIds(edges, edgeIds, questionIds, childQuestionNodeId)
      });
    };

    return { edgeIds, questionIds };
  };

  /**
   * Maps all known cuids of a prisma edge to a new cuid while maintaining relationships with parent/child nodes as well as edge conditions
   * @param idMap A map containing old cuid-replace cuid pairs
   * @param edge A prisma edge with conditions
   * @returns An edge with replaced cuids
   */
  static duplicateEdge(idMap: IdMapProps, edge: (Edge & {
    conditions: QuestionCondition[];
  })) {
    const mappedId = idMap[edge.id];
    const { childNodeId, parentNodeId, conditions, } = edge;
    // Should only not exist for the edge attaching start of branch to its parent
    const mappedParentNodeId = idMap[parentNodeId] || parentNodeId;
    const mappedChildNodeId = idMap[childNodeId];

    const mappedConditions = conditions.map(condition => {
      const { id, edgeId, ...rest } = condition;
      return { ...rest };
    });

    return { ...edge, id: mappedId, parentNodeId: mappedParentNodeId, questionNodeId: mappedParentNodeId, childNodeId: mappedChildNodeId, conditions: mappedConditions }
  }

  /**
   * Maps all existing ids of a prisma question to a new cuid
   * @param idMap A map containing the old cuid and a newly mapped cuid to it
   * @param question A prisma question
   * @returns A prisma question with new cuids
   */
  static mapQuestion(idMap: IdMapProps, question: QuestionNode & {
    options: QuestionOption[];
    videoEmbeddedNode: VideoEmbeddedNode | null;
    isOverrideLeafOf: QuestionNode[];
  }) {
    const mappedId = idMap[question.id];
    const mappedVideoEmbeddedNode: VideoEmbeddedNodeCreateOneWithoutQuestionNodeInput | undefined = question.videoEmbeddedNodeId ? { create: { videoUrl: question.videoEmbeddedNode?.videoUrl } } : undefined
    const mappedIsOverrideLeafOf = question.isOverrideLeafOf.map(({ id }) => ({ id }));
    const mappedOptions: QuestionOptionCreateManyWithoutQuestionNodeInput = {
      create: question.options.map((option) => {
        const { id, overrideLeafId, questionNodeId, questionId, ...rest } = option;
        return {
          position: rest.position,
          value: rest.value,
          publicValue: rest.publicValue,
          overrideLeaf: overrideLeafId ? {
            connect: {
              id: overrideLeafId,
            }
          } : undefined,
        }
      })
    };

    const mappedObject = {
      ...question,
      id: mappedId,
      videoEmbeddedNode: mappedVideoEmbeddedNode,
      options: mappedOptions,
      isOverrideLeafOf: mappedIsOverrideLeafOf,
    };

    return mappedObject;
  }

  /**
   * Duplicates the question and all its child questions
   * @questionId the parent question id used to generate a duplicated dialogue
   */
  static duplicateBranch = async (questionId: string) => {
    const idMap: IdMapProps = {};

    const question = await prisma.questionNode.findFirst({
      where: {
        id: questionId,
      },
      include: {
        // TODO: Add triggers and handle them in map function
        options: true,
        videoEmbeddedNode: true,
        isOverrideLeafOf: true,
      }
    });

    const edges = await prisma.edge.findMany({
      where: {
        dialogueId: question.questionDialogueId,
      },
      include: {
        conditions: true,
      }
    });

    const { edgeIds, questionIds } = NodeService.getNestedBranchIds(edges, [], [questionId], questionId);

    NodeService.createCuidPairs(idMap, [...questionIds, ...edgeIds, questionId]);

    const targetQuestions = await prisma.questionNode.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      include: {
        options: true,
        videoEmbeddedNode: true,
        isOverrideLeafOf: true,
        Edge: true,
      }
    });

    const updatedQuestions = targetQuestions.map((question) => {
      const mappedObject = NodeService.mapQuestion(idMap, question);
      return mappedObject;
    });

    const targetEdges = edges.filter((edge) => edgeIds.includes(edge.id));
    const parentQuestionEdge = edges.find((edge) => edge.childNodeId === questionId);

    if (!parentQuestionEdge) throw 'No edge exist to connect new branch to their parent'

    const updatedEdges: Enumerable<EdgeCreateWithoutDialogueInput> = [...targetEdges, parentQuestionEdge].map((edge) => {
      const mappedEdge = NodeService.duplicateEdge(idMap, edge);

      return {
        parentNode: {
          connect: {
            id: mappedEdge.parentNodeId,
          },
        },
        childNode: {
          connect: {
            id: mappedEdge.childNodeId,
          }
        },
        conditions: {
          create: mappedEdge.conditions,
        },

      };
    });

    await prisma.dialogue.update({
      where: {
        id: question.questionDialogueId || '-1',
      },
      data: {
        questions: {
          create: updatedQuestions.map((question) => ({
            id: question.id,
            isRoot: question.isRoot,
            isLeaf: question.isLeaf,
            title: question.title,
            type: question.type,
            options: question.options,
            videoEmbeddedNode: question.videoEmbeddedNode,
            isOverrideLeafOf: {
              connect: question.isOverrideLeafOf,
            },
            overrideLeaf: question.overrideLeafId ? {
              connect: {
                id: question.overrideLeafId,
              }
            } : undefined,
          })),
        },
        edges: {
          create: updatedEdges.map((edge) => ({
            childNode: edge.childNode,
            conditions: edge.conditions,
            parentNode: edge.parentNode,
          })),
        }
      },
    });

    return null;
  }

  static removeNonExistingLinks = async (
    existingLinks: Array<Link>,
    newLinks: NexusGenInputs['CTALinkInputObjectType'][],
  ) => {
    const newLinkIds = newLinks?.map(({ id }) => id);
    const removeLinkIds = existingLinks?.filter(({ id }) => (!newLinkIds?.includes(id) && id)).map(({ id }) => id);

    if (removeLinkIds?.length > 0) {
      await prisma.link.deleteMany({ where: { id: { in: removeLinkIds } } });
    }
  };

  /**
   * Save FormNodeInput when `creating`
   */
  static saveCreateFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): FormNodeCreateInput => ({
    helperText: input.helperText,
    fields: {
      create: input.fields?.map((field) => ({
        type: field.type || 'shortText',
        label: field.label || '',
        position: field.position || -1,
        placeholder: field.placeholder || '',
        isRequired: field.isRequired || false,
      })),
    },
  });

  static upsertLinks = async (
    newLinks: NexusGenInputs['CTALinkInputObjectType'][],
    questionId: string,
  ) => {
    newLinks?.forEach(async (link) => {
      await prisma.link.upsert({
        where: {
          id: link.id || '-1',
        },
        create: {
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
        update: {
          title: link.title,
          url: link.url || '',
          type: link.type || 'API',
          backgroundColor: link.backgroundColor,
          iconUrl: link.iconUrl || '',
        },
      });
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

  static createQuestionNode = async (
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
        create: options.length > 0 ? [
          ...options,
        ] : [],
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
        create: options.length > 0 ? [
          ...options,
        ] : [],
      },
    };

    return prisma.questionNode.create({
      data: params,
    });
  };

  static createTemplateLeafNodes = async (
    leafNodesArray: LeafNodeDataEntryProps[],
    dialogueId: string,
  ) => {
    // Make leafs based on array
    const leafs = await Promise.all(
      leafNodesArray.map(async ({ title, type, links, form }) => prisma.questionNode.create({
        data: {
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
              helperText: '',
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

    const deletedQuestion = await prisma.questionNode.findUnique({
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
    options: QuestionOptionProps[],
    edgeCondition: {
      id: number | null,
      conditionType: string,
      renderMin: number | null,
      renderMax: number | null,
      matchValue: string | null
    },
    extraContent: string | null,
  ) => {
    // TODO: Add sliderNode when a new sliderNode is created (doesn't happen now because only root slider node)
    const leaf = overrideLeafId !== 'None' ? { connect: { id: overrideLeafId } } : null;
    const videoEmbeddedNode: VideoEmbeddedNodeCreateOneWithoutQuestionNodeInput | undefined = extraContent ? {
      create: { videoUrl: extraContent }
    } : undefined;
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
            overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined,
            position: option.position,
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
    happyText: string | null | undefined,
    unhappyText: string | null | undefined,
  ) => {
    const existingQuestion = await prisma.questionNode.findUnique({
      where: { id: questionId },
      include: {
        videoEmbeddedNode: true,
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
      }
    });

    const existingEdge = await prisma.edge.findUnique({
      where: { id: edgeId },
      include: {
        conditions: true,
      },
    });

    const existingOptions = existingQuestion ? existingQuestion?.options?.map((option) => option.id) : [];
    const currentOverrideLeafId = existingQuestion?.overrideLeafId || null;
    const leaf = NodeService.getLeafState(currentOverrideLeafId, overrideLeafId);

    const existingEdgeCondition = existingEdge?.conditions && existingEdge.conditions[0];

    try {
      await NodeService.removeNonExistingQuestionOptions(existingOptions, options);
    } catch (e) {
      console.log('Something went wrong removing options: ', e);
    }

    try {
      if (existingEdgeCondition) {
        await NodeService.updateEdge(existingEdgeCondition, edgeCondition);
      } else {
        throw Error;
      }
    } catch (e) {
      console.log('something went wrong updating edges: ', e);
    }

    const updatedOptionIds = await NodeService.updateQuestionOptions(options);

    // Remove videoEmbeddedNode if updated to different type
    let embedVideoInput: VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput | undefined;
    if (existingQuestion?.type !== NodeType.VIDEO_EMBEDDED && existingQuestion?.videoEmbeddedNodeId) {
      embedVideoInput = { delete: true };
    }

    const updatedNode = leaf ? await prisma.questionNode.update({
      where: { id: questionId },
      data: {
        videoEmbeddedNode: embedVideoInput,
        title,
        overrideLeaf: leaf,
        type,
        options: {
          connect: updatedOptionIds,
        },
      },
      include: {
        videoEmbeddedNode: true,
      }
    }) : await prisma.questionNode.update({
      where: { id: questionId },
      data: {
        videoEmbeddedNode: embedVideoInput,
        title,
        type,
        options: {
          connect: updatedOptionIds,
        },
      },
      include: {
        videoEmbeddedNode: true,
      }
    });

    if (type === NodeType.VIDEO_EMBEDDED) {
      if (updatedNode.videoEmbeddedNodeId) {

        await prisma.videoEmbeddedNode.update({
          where: { id: updatedNode.videoEmbeddedNodeId },
          data: {
            videoUrl: extraContent,
          }
        })
      } else {
        await prisma.videoEmbeddedNode.create({
          data: {
            QuestionNode: {
              connect: { id: questionId },
            },
            videoUrl: extraContent,
          }
        })
      }
    } else if (type === NodeType.SLIDER) {
      if (updatedNode.sliderNodeId) {
        await prisma.sliderNode.update({
          where: { id: updatedNode.sliderNodeId },
          data: {
            happyText: happyText || null,
            unhappyText: unhappyText || null,
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
            happyText: happyText || null,
            unhappyText: unhappyText || null,
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

  static updateQuestionOptions = async (options: QuestionOptionProps[]): Promise<{ id: number }[]> => {
    const updates = Promise.all(options?.map(async (option) => {
      const updatedQuestionOption = await prisma.questionOption.upsert({
        where: { id: option.id ? option.id : -1 },
        create: {
          value: option.value,
          publicValue: option.publicValue,
          overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined,
          position: option.position,
        },
        update: {
          value: option.value,
          publicValue: option.publicValue,
          overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined,
          position: option.position,
        },
      });

      return { id: updatedQuestionOption.id };
    }));

    return updates;
  };

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

  static removeNonExistingQuestionOptions = async (
    existingOptions: number[],
    newOptions: QuestionOptionProps[],
  ) => {
    // TODO: Eventually check if any existing entries exist (so that we can block removing interacted values).
    const newOptionIds = newOptions?.map(({ id }) => id);

    const removeQuestionOptionsIds = existingOptions?.filter((id) => (!newOptionIds.includes(id) && id));

    if (removeQuestionOptionsIds?.length > 0) {
      await prisma.questionOption.deleteMany({ where: { id: { in: removeQuestionOptionsIds } } });
    }
  };

  static createTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await NodeService.createQuestionNode(
      `How do you feel about ${workspaceName}?`,
      dialogueId, NodeType.SLIDER, standardOptions, true,
    );

    // Positive Sub child 1 (What did you like?)
    const instagramNodeId = NodeService.getCorrectLeaf(leafs, 'Follow us on Instagram and stay');
    const rootToWhatDidYou = await NodeService.createQuestionNode(
      'What did you like?', dialogueId, NodeType.CHOICE, standardOptions, false,
      instagramNodeId,
    );

    // Positive Sub sub child 1 (Facilities)
    const comeAndJoin1stAprilId = NodeService.getCorrectLeaf(leafs,
      'Come and join us on 1st April for our great event');
    const whatDidYouToFacilities = await NodeService.createQuestionNode(
      'What exactly did you like about the facilities?', dialogueId,
      NodeType.CHOICE, facilityOptions, false, comeAndJoin1stAprilId,
    );

    // Positive Sub sub child 2 (Website)
    const whatDidYouToWebsite = await NodeService.createQuestionNode(
      'What exactly did you like about the website?', dialogueId,
      NodeType.CHOICE, websiteOptions, false, instagramNodeId,
    );

    // Positive Sub sub child 3 (Product/Services)
    const weThinkYouMightLikeThis = NodeService.getCorrectLeaf(
      leafs,
      'We think you might like this as',
    );

    const whatDidYouToProduct = await NodeService.createQuestionNode(
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
    const whatDidYouToCustomerSupport = await NodeService.createQuestionNode(
      'What exactly did you like about the customer support?', dialogueId,
      NodeType.CHOICE, customerSupportOptions, false, yourEmailBelowForNewsletter,
    );

    // Neutral Sub child 2
    const leaveYourEmailBelowToReceive = NodeService.getCorrectLeaf(leafs,
      'Leave your email below to receive our');
    const rootToWhatWouldYouLikeToTalkAbout = await NodeService.createQuestionNode(
      'What would you like to talk about?', dialogueId, NodeType.CHOICE,
      standardOptions, false, leaveYourEmailBelowToReceive,
    );

    // Neutral Sub sub child 1 (Facilities)
    const whatWouldYouLikeToTalkAboutToFacilities = await NodeService.createQuestionNode('Please specify.',
      dialogueId, NodeType.CHOICE, facilityOptions);

    // Neutral Sub sub child 2 (Website)
    const whatWouldYouLikeToTalkAboutToWebsite = await NodeService.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, websiteOptions,
    );

    // Neutral Sub sub child 3 (Product/Services)
    const whatWouldYouLikeToTalkAboutToProduct = await NodeService.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, productServicesOptions,
    );

    // Neutral Sub sub child 4 (Customer Support)
    const whatWouldYouLikeToTalkAboutToCustomerSupport = await NodeService.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, customerSupportOptions,
    );

    // Negative Sub child 3
    const rootToWeAreSorryToHearThat = await NodeService.createQuestionNode(
      'We are sorry to hear that! Where can we improve?', dialogueId,
      NodeType.CHOICE, standardOptions,
    );

    // Negative Sub sub child 1 (Facilities)
    const ourTeamIsOnIt = NodeService.getCorrectLeaf(leafs, 'Our team is on it');
    const weAreSorryToHearThatToFacilities = await NodeService.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, facilityOptions, false, ourTeamIsOnIt,
    );

    // Negative Sub sub child 2 (Website)
    const pleaseClickWhatsappLink = NodeService.getCorrectLeaf(leafs,
      'Please click on the Whatsapp link below so our service');
    const weAreSorryToHearThatToWebsite = await NodeService.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, websiteOptions,
      false, pleaseClickWhatsappLink,
    );

    // Negative Sub sub child 3 (Product/Services)
    const clickBelowForRefund = NodeService.getCorrectLeaf(leafs, 'Click below for your refund');
    const weAreSorryToHearThatToProduct = await NodeService.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, productServicesOptions,
      false, clickBelowForRefund,
    );

    // Negative Sub sub child 4 (Customer Support)
    const ourCustomerExperienceSupervisor = NodeService.getCorrectLeaf(leafs,
      'Our customer experience supervisor is');
    const weAreSorryToHearThatToCustomerSupport = await NodeService.createQuestionNode(
      'Please elaborate', dialogueId, NodeType.CHOICE, customerSupportOptions,
      false, ourCustomerExperienceSupervisor,
    );

    // ################################### EDGES ################################

    // Positive edges
    await EdgeService.createEdge(rootQuestion, rootToWhatDidYou,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    await EdgeService.createEdge(rootToWhatDidYou, whatDidYouToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await EdgeService.createEdge(rootToWhatDidYou, whatDidYouToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      });

    await EdgeService.createEdge(rootToWhatDidYou, whatDidYouToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMin: null, renderMax: null });

    await EdgeService.createEdge(rootToWhatDidYou, whatDidYouToCustomerSupport,
      { conditionType: 'match', matchValue: 'Customer Support', renderMin: null, renderMax: null });

    // Neutral edges
    await EdgeService.createEdge(rootQuestion, rootToWhatWouldYouLikeToTalkAbout,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 50, renderMax: 70 });

    await EdgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout, whatWouldYouLikeToTalkAboutToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await EdgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      });

    await EdgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToProduct, {
      conditionType: 'match',
      matchValue: 'Product/Services',
      renderMin: null,
      renderMax: null,
    });

    await EdgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToCustomerSupport, {
      conditionType: 'match',
      matchValue: 'Customer Support',
      renderMin: null,
      renderMax: null,
    });

    // Negative edges
    await EdgeService.createEdge(rootQuestion, rootToWeAreSorryToHearThat,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 50 });

    await EdgeService.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMax: null, renderMin: null });

    await EdgeService.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToWebsite,
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMax: null,
        renderMin: null,
      });

    await EdgeService.createEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMax: null, renderMin: null });

    await EdgeService.createEdge(rootToWeAreSorryToHearThat,
      weAreSorryToHearThatToCustomerSupport, {
      conditionType: 'match',
      matchValue: 'Customer Support',
      renderMax: null,
      renderMin: null,
    });
  };
}

export default NodeService;
