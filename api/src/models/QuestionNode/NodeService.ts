import { Prisma, Link, NodeType, QuestionCondition, QuestionNode, PrismaClient, Share, Edge, QuestionOption, VideoEmbeddedNode } from '@prisma/client';
import cuid from 'cuid';

import { NexusGenInputs } from '../../generated/nexus';
import EdgeService from '../edge/EdgeService';
import { QuestionOptionProps, LeafNodeDataEntryProps, CreateCTAInputProps, DialogueWithEdges } from './NodeServiceType';
import QuestionNodePrismaAdapter from './QuestionNodePrismaAdapter';
import { findDifference } from '../../utils/findDifference';
import EdgePrismaAdapter, { CreateEdgeInput } from '../edge/EdgePrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateQuestionsInput, CreateQuestionInput } from '../questionnaire/DialoguePrismaAdapterType';
import { CreateCTAInput, UpdateQuestionInput } from './QuestionNodePrismaAdapterType';

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
  prisma: PrismaClient;
  questionNodePrismaAdapter: QuestionNodePrismaAdapter;
  edgeService: EdgeService;
  edgePrismaAdapter: EdgePrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.edgePrismaAdapter = new EdgePrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.prisma = prismaClient;
  }

  /**
   * Find node by its own id.
   * */
  findNodeById(nodeId: string) {
    return this.questionNodePrismaAdapter.findNodeById(nodeId);
  }

  /**
   * Get all child-edges belonging to node.
   * */
  getChildEdgesOfNode(nodeId: string) {
    return this.edgePrismaAdapter.getEdgesByParentQuestionId(nodeId);
  }

  /**
   * Get all options belonging to node.
   * */
  getOptionsByNodeId(parentId: string) {
    return this.questionNodePrismaAdapter.findOptionsByQuestionId(parentId);
  }

  /**
   * Get connected share-node by node id.
   * */
  async getShareNode(parentId: string) {
    return this.questionNodePrismaAdapter.getShareNodeByQuestionId(parentId);
  }

  /**
   * Get connected video-node by node id.
   * */
  getVideoEmbeddedNode(nodeId: string) {
    return this.questionNodePrismaAdapter.getVideoNodeById(nodeId);
  }

  /**
   * Create call-to-action.
   * */
  async createCallToAction(input: CreateCTAInputProps) {
    const dialogue = await this.dialoguePrismaAdapter.getDialogueBySlugs(input.customerSlug, input.dialogueSlug);
    if (!dialogue?.id) throw 'No Dialogue found to add CTA to!'

    const callToAction = await this.questionNodePrismaAdapter.createCallToAction({
      dialogueId: dialogue.id,
      links: input.links,
      share: input.share,
      title: input.title,
      form: input.form,
      type: input.type
    });

    return callToAction;
  }

  /**
   * Deletes node.
   *
   * TODO: Figure out what the difference is between deleteQuestionNode and deleteNode.
   * */
  deleteNode(id: string): Promise<QuestionNode> {
    return this.questionNodePrismaAdapter.delete(id);
  }

  /**
   * Converts FormNode to Prisma-friendly format.
   * */
  saveEditFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): Prisma.FormNodeFieldUpsertArgs[] | undefined => (
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

  /**
   * Updates existing call-to-action.
   * */
  async updateCTA(input: NexusGenInputs['UpdateCTAInputType']) {
    if (!input.id) {
      throw new Error('No ID Found');
    }

    const existingNode = await this.questionNodePrismaAdapter.getCTANode(input.id);

    // If a share was previously on the node, but not any longer the case, disconnect it.
    if (existingNode?.share && (!input?.share || input?.type !== 'SHARE')) {
      await this.questionNodePrismaAdapter.deleteShareNode(existingNode.share.id);
    }

    // If type is share, create a share connection (or update it)
    if (input?.share && input?.share.id && input?.type === 'SHARE' && existingNode?.id) {
      await this.questionNodePrismaAdapter.upsertShareNode(input?.share.id,
        {
          title: input?.share.title || '',
          url: input?.share.url || '',
          tooltip: input?.share.tooltip || '',
          questionId: existingNode?.id,
        },
        {
          title: input?.share.title || '',
          url: input?.share.url || '',
          tooltip: input?.share.tooltip || '',
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
        const mappedFields = removedFields.map((field) => ({ id: field?.id?.toString() || '' }))
        await this.questionNodePrismaAdapter.removeFormFields(input.id, mappedFields);
      }

      if (existingNode?.form) {
        const fields = this.saveEditFormNodeInput(input.form) || [];
        await this.questionNodePrismaAdapter.updateFieldsOfForm({
          questionId: input.id,
          fields,
          helperText: input.form.helperText || '',
        })
      } else {
        const fields = NodeService.saveCreateFormNodeInput(input.form);
        await this.questionNodePrismaAdapter.createFieldsOfForm({
          questionId: input.id,
          fields,
          helperText: input.form.helperText || '',
        });
      };
    };

    // Finally, update question-node
    return this.questionNodePrismaAdapter.update(input.id, {
      title: input?.title || '',
      type: input.type || 'GENERIC',
    });
  };

  /**
   * Find node belonging to a link.
   * **/
  findNodeByLinkId(linkId: string) {
    return this.questionNodePrismaAdapter.findNodeByLinkId(linkId);
  }

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
  })): CreateEdgeInput {
    const mappedId = idMap[edge.id];
    const { childNodeId, parentNodeId, conditions, dialogueId } = edge;
    // Should only not exist for the edge attaching start of branch to its parent
    const mappedParentNodeId = idMap[parentNodeId] || parentNodeId;
    const mappedChildNodeId = idMap[childNodeId];

    const mappedConditions = conditions.map(condition => {
      const { id, edgeId, ...rest } = condition;
      return { ...rest };
    });

    return { ...edge, dialogueId: dialogueId || '-1', id: mappedId, parentNodeId: mappedParentNodeId, childNodeId: mappedChildNodeId, conditions: mappedConditions }
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
  }): CreateQuestionInput {
    const mappedId = idMap[question.id];
    const mappedVideoEmbeddedNode: Prisma.VideoEmbeddedNodeCreateWithoutQuestionNodeInput | undefined = question.videoEmbeddedNodeId ? { videoUrl: question.videoEmbeddedNode?.videoUrl } : undefined
    const mappedIsOverrideLeafOf = question.isOverrideLeafOf.map(({ id }) => ({ id }));
    const mappedOptions: QuestionOptionProps[] = question.options.map((option) => {
      const { id, overrideLeafId, questionNodeId, questionId, ...rest } = option;
      return {
        position: rest.position,
        value: rest.value,
        publicValue: rest.publicValue,
        overrideLeafId: overrideLeafId || undefined,
      };
    });

    const mappedObject = {
      ...question,
      id: mappedId,
      videoEmbeddedNode: mappedVideoEmbeddedNode,
      options: mappedOptions,
      isOverrideLeafOf: mappedIsOverrideLeafOf,
      overrideLeafId: question.overrideLeafId || undefined,
    };

    return mappedObject;
  }

  /**
   * Duplicates the question and all its child questions
   * @questionId the parent question id used to generate a duplicated dialogue
   */
  duplicateBranch = async (questionId: string) => {
    const idMap: IdMapProps = {};

    const question = await this.questionNodePrismaAdapter.findNodeById(questionId);

    if (!question || !question.questionDialogueId) return null;

    const edges = await this.edgePrismaAdapter.getEdgesByDialogueId(question.questionDialogueId);

    const { edgeIds, questionIds } = NodeService.getNestedBranchIds(edges, [], [questionId], questionId);

    NodeService.createCuidPairs(idMap, [...questionIds, ...edgeIds, questionId]);

    const targetQuestions = await this.questionNodePrismaAdapter.getNodesByNodeIds(questionIds);

    const updatedQuestions = targetQuestions.map((question) => {
      const mappedObject = NodeService.mapQuestion(idMap, question);
      return mappedObject;
    });

    const targetEdges = edges.filter((edge) => edgeIds.includes(edge.id));
    const parentQuestionEdge = edges.find((edge) => edge.childNodeId === questionId);

    if (!parentQuestionEdge) throw 'No edge exist to connect new branch to their parent'

    const updatedEdges: Array<CreateEdgeInput> = [...targetEdges, parentQuestionEdge].map((edge) => {
      const mappedEdge = NodeService.duplicateEdge(idMap, edge);
      return mappedEdge;
    });

    await this.dialoguePrismaAdapter.createNodes(question.questionDialogueId, updatedQuestions);
    await this.dialoguePrismaAdapter.createEdges(question.questionDialogueId, updatedEdges);

    return null;
  }

  removeNonExistingLinks = async (
    existingLinks: Array<Link>,
    newLinks: NexusGenInputs['CTALinkInputObjectType'][],
  ) => {
    const newLinkIds = newLinks?.map(({ id }) => id);
    const removeLinkIds = existingLinks?.filter(({ id }) => (!newLinkIds?.includes(id) && id)).map(({ id }) => id);

    if (removeLinkIds?.length > 0) {
      await this.deleteLinks(removeLinkIds);
    }
  };

  /**
   * Save FormNodeInput when `creating`
   */
  static saveCreateFormNodeInput = (input: NexusGenInputs['FormNodeInputType']): Prisma.FormNodeCreateInput => ({
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

  /**
   * Get all links belonging to a particular node.
   * */
  getLinksByNodeId(parentId: string): Promise<Link[]> {
    return this.questionNodePrismaAdapter.getLinksByNodeId(parentId);
  };

  /**
   * Delete all links.
   * */
  deleteLinks(linkIds: string[]) {
    return this.questionNodePrismaAdapter.deleteLinks(linkIds);
  };

  upsertLinks = async (
    newLinks: NexusGenInputs['CTALinkInputObjectType'][],
    questionId: string,
  ) => {
    newLinks?.forEach(async (link) => {
      await this.questionNodePrismaAdapter.upsertLink(link.id || '-1',
        {
          title: link.title || '',
          url: link.url || '',
          type: link.type || 'API',
          backgroundColor: link.backgroundColor || '',
          iconUrl: link.iconUrl || '',
          buttonText: link.buttonText || '',
          header: link.header || '',
          subHeader: link.subHeader || '',
          imageUrl: link.imageUrl || '',
          questionId,
        },
        {
          title: link.title || '',
          url: link.url || '',
          type: link.type || 'API',
          backgroundColor: link.backgroundColor || '',
          iconUrl: link.iconUrl || '',
          buttonText: link.buttonText || '',
          header: link.header || '',
          subHeader: link.subHeader || '',
          imageUrl: link.imageUrl || '',
        }
      );
    });
  };

  static constructQuestionNode = (
    title: string,
    questionnaireId: string,
    type: NodeType,
    options: Array<any> = [],
    isRoot: boolean = false,
    overrideLeafId: string = '',
    isLeaf: boolean = false
  ): Prisma.QuestionNodeCreateInput => {
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

  /**
   * Create node.
   * */
  createQuestionNode = async (
    title: string,
    questionnaireId: string,
    type: NodeType,
    options: Array<any> = [],
    isRoot: boolean = false,
    overrideLeafId: string = '',
    isLeaf: boolean = false
  ) => {
    const qOptions = options.length > 0 ? [
      ...options,
    ] : [];

    const params: CreateQuestionInput =
    {
      isRoot,
      isLeaf,
      title,
      type,
      options: qOptions,
      overrideLeafId,
      dialogueId: questionnaireId,
    }

    return this.questionNodePrismaAdapter.createQuestion(params);
  };

  /**
   * Create template call-to-actions.
   * */
  createTemplateLeafNodes = async (
    leafNodesArray: LeafNodeDataEntryProps[],
    dialogueId: string,
  ) => {
    const mappedLeafs: CreateQuestionsInput = leafNodesArray.map((leaf) => {
      return ({
        ...leaf,
        title: leaf.title,
        type: leaf.type,
        dialogueId: dialogueId,
        isRoot: false,
        isLeaf: true,
        form: {
          helperText: '',
          fields: leaf?.form?.fields?.length ? leaf.form?.fields.map((field) => ({
            label: field.label || '',
            position: field.position || -1,
            isRequired: field.isRequired || false,
            type: field.type || 'shortText',
          })) : [],
        }
      })
    });

    // Make leafs based on array
    const updatedNodes = await this.dialoguePrismaAdapter.createNodes(dialogueId, mappedLeafs);
    const finalLeafNodes = updatedNodes.filter((node) => node.isLeaf);

    return finalLeafNodes;
  };

  /**
   * Find a call-to-action containing text.
   * */
  static findLeafIdContainingText = (leafs: QuestionNode[], titleSubset: string) => {
    const correctLeaf = leafs.find((leaf) => leaf.title.includes(titleSubset));
    return correctLeaf?.id;
  };

  /**
   * Construct update leaf state to use in Prisma call.
   *
   * TODO: Move to prisma-adapter.
   * */
  static constructUpdateLeafState = (currentOverrideLeafId: string | null, newOverrideLeafId: string | null) => {
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

  /**
   * Update an edge based on new condition.
   *
   * TODO: Move to EdgeService.
   * */
  updateEdge = async (
    dbEdgeCondition: QuestionCondition,
    newEdgeCondition: Omit<QuestionCondition, 'edgeId'>,
  ) => this.edgePrismaAdapter.updateCondition(dbEdgeCondition.id, {
    conditionType: newEdgeCondition.conditionType,
    matchValue: newEdgeCondition.matchValue,
    renderMin: newEdgeCondition.renderMin,
    renderMax: newEdgeCondition.renderMax,
  });

  /**
   * Get delete ids (?)
   * */
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

  /**
   * Deletes a question.
   *
   * TODO: Figure out what the difference is between deleteQuestionNode and deleteNode.
   * */
  deleteQuestionNode = async (id: string, dialogue: DialogueWithEdges) => {
    const foundEdgeIds: string[] = [];
    const foundQuestionIds: string[] = [id];
    const edgeToDeleteQuestion = dialogue.edges.find((edge) => edge.childNodeId === id);

    if (edgeToDeleteQuestion) {
      foundEdgeIds.push(edgeToDeleteQuestion.id);
    }

    const { edgeIds, questionIds } = NodeService.getDeleteIDs(dialogue.edges, dialogue.questions, foundEdgeIds, foundQuestionIds);

    await this.edgePrismaAdapter.deleteMany(edgeIds);

    const deletedQuestion = await this.questionNodePrismaAdapter.findNodeById(id);

    await this.questionNodePrismaAdapter.deleteShareNodesByQuestionId(id);

    if (deletedQuestion?.videoEmbeddedNodeId) {
      await this.questionNodePrismaAdapter.deleteVideoNode(deletedQuestion?.videoEmbeddedNodeId);
    }

    await this.questionNodePrismaAdapter.deleteMany(questionIds);

    const questionToDelete = dialogue.questions.find((question) => id === question.id);
    return questionToDelete;
  };

  /**
   * Creates a node (from builder).
   *
   * TODO: Figure out waht difference is between createQuestionFromBuilder and createQuestionNode
   * */
  createQuestionFromBuilder = async (
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
    const params: CreateQuestionInput =
    {
      isRoot: false,
      isLeaf: false,
      title,
      type,
      options,
      overrideLeafId: (overrideLeafId && overrideLeafId !== 'None') ? overrideLeafId : undefined,
      dialogueId,
      videoEmbeddedNode: extraContent ? { videoUrl: extraContent } : undefined,
    }

    const newQuestion = await this.questionNodePrismaAdapter.createQuestion(params);
    await this.edgePrismaAdapter.createEdge({
      dialogueId,
      parentNodeId: parentQuestionId,
      conditions: [{
        renderMin: edgeCondition.renderMin,
        renderMax: edgeCondition.renderMax,
        matchValue: edgeCondition.matchValue,
        conditionType: edgeCondition.conditionType,
      }],
      childNodeId: newQuestion.id,
    });

    return newQuestion;
  };

  /**
   * Update node from builer.
   *
   * TODO: Rename to updateNode.
   * */
  updateQuestionFromBuilder = async (
    questionId: string,
    title: string,
    type: NodeType,
    overrideLeafId: string | null,
    edgeId: string | undefined,
    options: QuestionOptionProps[],
    edgeCondition: QuestionCondition,
    sliderNode: NexusGenInputs['SliderNodeInputType'],
    extraContent: string | null | undefined,
    happyText: string | null | undefined,
    unhappyText: string | null | undefined,
  ) => {
    const activeQuestion = await this.questionNodePrismaAdapter.getDialogueBuilderNode(questionId);

    const dbEdge = await this.edgeService.getEdgeById(edgeId || '-1');

    const activeOptions = activeQuestion ? activeQuestion?.options?.map((option) => option.id) : [];
    const currentOverrideLeafId = activeQuestion?.overrideLeafId || null;
    const leaf = NodeService.constructUpdateLeafState(currentOverrideLeafId, overrideLeafId);

    const existingEdgeCondition = dbEdge?.conditions && dbEdge.conditions[0];

    try {
      await this.removeNonExistingQuestionOptions(activeOptions, options);
    } catch (e) {
      console.log('Something went wrong removing options: ', e);
    };

    // Updating any question except root question should have this edge
    if (existingEdgeCondition) {
      try {
        await this.updateEdge(existingEdgeCondition, edgeCondition);
      } catch (e) {
        // @ts-ignore
        console.log('something went wrong updating edges: ', e.stack);
      }
    };

    const updateInput: UpdateQuestionInput = {
      title,
      type,
      options,
      overrideLeafId: overrideLeafId || undefined,
      currentOverrideLeafId: currentOverrideLeafId,
      videoEmbeddedNode: {
        id: activeQuestion?.videoEmbeddedNodeId || undefined
      },
    };

    const updatedNode = await this.questionNodePrismaAdapter.updateDialogueBuilderNode(questionId, updateInput);

    if (type === NodeType.VIDEO_EMBEDDED) {
      if (updatedNode?.videoEmbeddedNodeId) {
        await this.questionNodePrismaAdapter.updateVideoNode(updatedNode.videoEmbeddedNodeId, {
          videoUrl: extraContent,
        });
      } else {
        await this.questionNodePrismaAdapter.createVideoNode({
          videoUrl: extraContent,
          parentNodeId: questionId,
        });
      }
    } else if (type === NodeType.SLIDER) {
      if (updatedNode?.sliderNodeId) {
        await this.questionNodePrismaAdapter.updateSliderNode(updatedNode.sliderNodeId, {
          happyText: happyText || null,
          unhappyText: unhappyText || null,
          markers: sliderNode?.markers,
        });
      } else {
        await this.questionNodePrismaAdapter.createSliderNode({
          happyText: happyText || null,
          unhappyText: unhappyText || null,
          parentNodeId: questionId,
          markers: sliderNode?.markers,
        });
      };
    };

    return updatedNode;
  };

  /**
   * Remove non-existing question options.
   * */
  removeNonExistingQuestionOptions = async (
    existingOptions: number[],
    newOptions: QuestionOptionProps[],
  ) => {
    // TODO: Eventually check if any existing entries exist (so that we can block removing interacted values).
    const newOptionIds = newOptions?.map(({ id }) => id);

    const removeQuestionOptionsIds = existingOptions?.filter((id) => (!newOptionIds.includes(id) && id));

    if (removeQuestionOptionsIds?.length > 0) {
      await this.questionNodePrismaAdapter.deleteQuestionOptions(removeQuestionOptionsIds);
    }
  };

  /**
   * Create nodes from a default template.
   * */
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
    const instagramNodeId = NodeService.findLeafIdContainingText(leafs, 'Follow us on Instagram and stay');
    const rootToWhatDidYou = await this.createQuestionNode(
      'What did you like?', dialogueId, NodeType.CHOICE, standardOptions, false,
      instagramNodeId,
    );

    // Positive Sub sub child 1 (Facilities)
    const comeAndJoin1stAprilId = NodeService.findLeafIdContainingText(leafs,
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
    const weThinkYouMightLikeThis = NodeService.findLeafIdContainingText(
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
    const yourEmailBelowForNewsletter = NodeService.findLeafIdContainingText(leafs,
      'your email below to receive our newsletter');
    const whatDidYouToCustomerSupport = await this.createQuestionNode(
      'What exactly did you like about the customer support?', dialogueId,
      NodeType.CHOICE, customerSupportOptions, false, yourEmailBelowForNewsletter,
    );

    // Neutral Sub child 2
    const leaveYourEmailBelowToReceive = NodeService.findLeafIdContainingText(leafs,
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
    const ourTeamIsOnIt = NodeService.findLeafIdContainingText(leafs, 'Our team is on it');
    const weAreSorryToHearThatToFacilities = await this.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, facilityOptions, false, ourTeamIsOnIt,
    );

    // Negative Sub sub child 2 (Website)
    const pleaseClickWhatsappLink = NodeService.findLeafIdContainingText(leafs,
      'Please click on the Whatsapp link below so our service');
    const weAreSorryToHearThatToWebsite = await this.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, websiteOptions,
      false, pleaseClickWhatsappLink,
    );

    // Negative Sub sub child 3 (Product/Services)
    const clickBelowForRefund = NodeService.findLeafIdContainingText(leafs, 'Click below for your refund');
    const weAreSorryToHearThatToProduct = await this.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, productServicesOptions,
      false, clickBelowForRefund,
    );

    // Negative Sub sub child 4 (Customer Support)
    const ourCustomerExperienceSupervisor = NodeService.findLeafIdContainingText(leafs,
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
