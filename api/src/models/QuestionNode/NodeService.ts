import { Prisma, Link, NodeType, QuestionCondition, QuestionNode, PrismaClient, Edge, QuestionOption, VideoEmbeddedNode } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import cuid from 'cuid';

import { NexusGenInputs } from '../../generated/nexus';
import EdgeService from '../edge/EdgeService';
import { QuestionOptionProps, CreateCTAInputProps, DialogueWithEdges } from './NodeServiceType';
import QuestionNodePrismaAdapter from './QuestionNodePrismaAdapter';
import { findDifference } from '../../utils/findDifference';
import EdgePrismaAdapter, { CreateEdgeInput } from '../edge/EdgePrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateQuestionInput } from '../questionnaire/DialoguePrismaAdapterType';
import { CreateSliderNodeInput, UpdateQuestionInput } from './QuestionNodePrismaAdapterType';
import UserService from '../../models/users/UserService';
import UserOfCustomerPrismaAdapter from '../../models/users/UserOfCustomerPrismaAdapter';

export interface IdMapProps {
  [details: string]: string;
}

export class NodeService {
  prisma: PrismaClient;
  questionNodePrismaAdapter: QuestionNodePrismaAdapter;
  edgeService: EdgeService;
  edgePrismaAdapter: EdgePrismaAdapter;
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  userService: UserService;
  userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.edgePrismaAdapter = new EdgePrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.userService = new UserService(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.prisma = prismaClient;
  }

  /**
   * Creates a slider node and connects it to a question
   * @param data
   * @returns
   */
  createSliderNode = async (data: CreateSliderNodeInput) => {
    return this.questionNodePrismaAdapter.createSliderNode(data);
  };

  /**
   * Finds the slider node of a dialogue
   * @param dialogueId
   * @returns question node
   */
  findSliderNode = async (dialogueId: string) => {
    return this.questionNodePrismaAdapter.findSliderNodeByDialogueId(dialogueId);
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

    const form = input.form ? await this.saveCreateFormNodeInput(input.form, input.customerSlug) : undefined;

    const callToAction = await this.questionNodePrismaAdapter.createCallToAction({
      dialogueId: dialogue.id,
      links: input.links,
      share: input.share,
      title: input.title,
      form: form as any,
      type: input.type,
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
  saveEditFormNodeInput = async (input: NexusGenInputs['FormNodeInputType'], workspaceSlug: string): Promise<Prisma.FormNodeFieldUpsertArgs[] | undefined> => {
    const communicationUser = input.fields?.find((field) => field.userIds?.length);
    const targetUsers = communicationUser?.userIds?.length
      ? await this.userOfCustomerPrismaAdapter.findTargetUsers(
        workspaceSlug, {
        roleIds: communicationUser?.userIds.filter(isPresent),
        userIds: communicationUser?.userIds.filter(isPresent),
      }
      )
      : [];
    const allUserIds = targetUsers.map((user) => ({ id: user.userId }));

    return (
      input.fields?.map((field) => ({
        create: {
          type: field.type || 'shortText',
          label: field.label || 'Generic',
          position: field.position || -1,
          isRequired: field.isRequired || false,
          contacts: field.type === 'contacts' ? {
            connect: allUserIds,
          } : undefined,
        },
        update: {
          type: field.type || 'shortText',
          label: field.label || 'Generic',
          position: field.position || -1,
          isRequired: field.isRequired || false,
          contacts: field.type === 'contacts' ? {
            set: allUserIds,
          } : {
            set: [],
          },
        },
        where: {
          id: field.id || '-1',
        },
      })) || undefined
    )
  };

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
      await this.removeNonExistingLinks(existingNode?.links, input?.links?.linkTypes as any);
    }

    // Upsert links in g eneral
    if (input?.links?.linkTypes?.length) {
      await this.upsertLinks(input?.links?.linkTypes as any, input?.id);
    }

    // If form is passed
    if (input?.form && input.id) {
      const removedFields = findDifference(existingNode?.form?.fields, input?.form?.fields as any);

      if (removedFields.length) {
        const mappedFields = removedFields.map((field) => ({ id: field?.id?.toString() || '' }))
        await this.questionNodePrismaAdapter.removeFormFields(input.id, mappedFields);
      }

      if (existingNode?.form) {
        const fields = await this.saveEditFormNodeInput(input.form, input.customerSlug) || [];
        await this.questionNodePrismaAdapter.updateFieldsOfForm({
          questionId: input.id,
          fields,
          helperText: input.form.helperText || '',
        })
      } else {
        const fields = await this.saveCreateFormNodeInput(input.form, input.customerSlug);
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
        isTopic: rest.isTopic,
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
  saveCreateFormNodeInput = async (input: NexusGenInputs['FormNodeInputType'], workspaceSlug: string): Promise<Prisma.FormNodeCreateInput> => {
    const communicationUser = input.fields?.find((field) => field.userIds?.length);
    const targetUsers = communicationUser?.userIds?.length
      ? await this.userOfCustomerPrismaAdapter.findTargetUsers(
        workspaceSlug, {
        roleIds: communicationUser?.userIds.filter(isPresent), userIds: communicationUser?.userIds.filter(isPresent),
      }
      )
      : [];
    const allUserIds = targetUsers.map((user) => ({ id: user.userId }));

    return ({
      helperText: input.helperText,
      fields: {
        create: input.fields?.map((field) => ({
          type: field.type || 'shortText',
          label: field.label || '',
          position: field.position || -1,
          placeholder: field.placeholder || '',
          isRequired: field.isRequired || false,
          contacts: field.type === 'contacts' ? {
            connect: allUserIds,
          } : undefined,
        })),
      },
    })
  };

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
    const qOptions = options.length > 0 ? options : [];
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
    edges: Array<{ id: string; childNodeId: string; parentNodeId: string }>,
    questions: Array<{ id: string }>, foundEdgeIds: Array<string>,
    foundQuestionIds: Array<string>,
  ): { edgeIds: Array<string>; questionIds: Array<string> } => {
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
      id: number | null;
      conditionType: string;
      renderMin: number | null;
      renderMax: number | null;
      matchValue: string | null;
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
   * Finds stale condition values, mapping from old values to new values.
   * @param dbOptions a list of options before question is updated
   * @param newOptions a list of updated options
   */
  getStaleConditionsMap(
    newOptions: QuestionOptionProps[],
    dbOptions: QuestionOption[],
  ): Record<string, string> {
    const staleConditionOptions: { [key: string]: string } = {};

    newOptions.forEach((option) => {
      // Check which options have an ID (meaning they already existed)
      if (!option.id) return;

      // Find option in database that matches the updated option from the dashboard
      const dbOption = dbOptions.find((dbOption) => dbOption.id === option.id);
      if (!dbOption) return;

      // If the values have changed, we mark the
      // If the values are not the same add a key-value pair of both the old and new value to the updatable object
      if (dbOption.value !== option.value) {
        staleConditionOptions[dbOption.value] = option.value;
      }
    });

    return staleConditionOptions;
  }

  /**
   * Finds and updates edges if an existing option in parent question has changed
   * @param dbOptions a list of options before question is updated
   * @param newOptions a list of updated options
   */
  updateStaleEdgeConditions = async (
    newOptions: QuestionOptionProps[],
    dbOptions?: QuestionOption[],
    questionId?: string
  ) => {
    if (!dbOptions || !questionId) return;

    const staleConditionMap = this.getStaleConditionsMap(newOptions, dbOptions);

    // If there are no changes for existing options don't do anyting
    if (Object.keys(staleConditionMap).length === 0) return;

    // Find the edges of which the option in the parent node has changed
    const edges = await this.edgeService.edgePrismaAdapter.findEdgesOfConditions(
      questionId,
      Object.keys(staleConditionMap)
    );

    if (edges.length === 0) return;

    // Update all edges with their new values
    await Promise.all(edges.map(async (edge) => {
      const condition = edge.conditions[0];
      const updatedCondition = await this.edgeService.edgePrismaAdapter.updateCondition(condition.id, {
        matchValue: staleConditionMap[condition.matchValue as string],
      });

      return updatedCondition;
    }));
  }

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

    await this.updateStaleEdgeConditions(options, activeQuestion?.options, activeQuestion?.id);

    const updateInput: UpdateQuestionInput = {
      title,
      type,
      options,
      overrideLeafId: overrideLeafId || undefined,
      currentOverrideLeafId: currentOverrideLeafId,
      videoEmbeddedNode: {
        id: activeQuestion?.videoEmbeddedNodeId || undefined,
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
          markers: sliderNode?.markers?.filter(isPresent),
        });
      } else {
        await this.questionNodePrismaAdapter.createSliderNode({
          happyText: happyText || null,
          unhappyText: unhappyText || null,
          parentNodeId: questionId,
          markers: sliderNode?.markers?.filter(isPresent),
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

}

export default NodeService;
