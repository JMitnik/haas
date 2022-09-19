import { Prisma, Link, NodeType, QuestionCondition, QuestionNode, PrismaClient, Edge, QuestionOption, VideoEmbeddedNode } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import cuid from 'cuid';

import { NexusGenInputs } from '../../generated/nexus';
import EdgeService from '../edge/EdgeService';
import {
  QuestionOptionProps,
  CreateCTAInputProps,
  DialogueWithEdges,
  FormNodeInput,
  FormNodeStepInput,
  SimpleQuestionInput,
} from './NodeServiceType';
import QuestionNodePrismaAdapter from './QuestionNodePrismaAdapter';
import { findDifference } from '../../utils/findDifference';
import EdgePrismaAdapter, { CreateEdgeInput } from '../edge/EdgePrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CreateQuestionInput } from '../questionnaire/DialoguePrismaAdapterType';
import { CreateSliderNodeInput, UpdateQuestionInput } from './QuestionNodePrismaAdapterType';
import { QuestionNode as FullQuestionNode } from './QuestionNode.types';
import UserOfCustomerPrismaAdapter from '../../models/users/UserOfCustomerPrismaAdapter';
import { groupBy } from 'lodash';

export interface IdMapProps {
  [details: string]: string;
}

export class NodeService {
  private prisma: PrismaClient;
  private questionNodePrismaAdapter: QuestionNodePrismaAdapter;
  private edgeService: EdgeService;
  private edgePrismaAdapter: EdgePrismaAdapter;
  private dialoguePrismaAdapter: DialoguePrismaAdapter;
  private userOfCustomerPrismaAdapter: UserOfCustomerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.edgePrismaAdapter = new EdgePrismaAdapter(prismaClient);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.userOfCustomerPrismaAdapter = new UserOfCustomerPrismaAdapter(prismaClient);
    this.prisma = prismaClient;
  }

  /**
   * Finds the slidernode by its parent question ID
   * @param parentQuestionNodeId
   * @returns
   */
  public async findSliderNodeByParentId(parentQuestionNodeId: string) {
    return (await this.questionNodePrismaAdapter.findSliderNodeByParentId(parentQuestionNodeId))?.sliderNode;
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
   * Finds the root node of a dialogue
   * @param dialogueId
   * @returns question node
   */
  public async findRootNode(dialogueId: string) {
    return this.questionNodePrismaAdapter.findRootNodeByDialogueId(dialogueId);
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

    const form = input.form ? await this.createFormNodeInput(input.form, input.customerSlug) : undefined;

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
  private async saveEditFormNodeFieldInput(
    input: FormNodeStepInput,
    workspaceSlug: string,
    stepId: string,
  ): Promise<Prisma.FormNodeFieldUpsertArgs[]> {
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
          formNodeStep: {
            connect: {
              id: stepId,
            },
          },
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
      })) || []
    )
  };

  private async saveEditFormStepInput(
    step: FormNodeStepInput,
    formNodeId: string,
  ): Promise<Prisma.FormNodeStepUpsertArgs> {
    return {
      create: {
        ...step,
        id: step.id || undefined,
        fields: undefined,
        formNode: {
          connect: {
            id: formNodeId,
          },
        },
      },
      update: {
        ...step,
        id: step.id || undefined,
        fields: undefined,
      },
      where: {
        id: step.id || '-1',
      },
    }
  };

  /**
   * Converts FormNode to Prisma-friendly format.
   */
  private async saveEditFormNodeInput(
    step: FormNodeStepInput,
    workspaceSlug: string,
    dbStepId: string,
  ): Promise<Prisma.FormNodeFieldUpsertWithWhereUniqueWithoutFormNodeStepInput[] | undefined> {
    if (!step.fields?.length) return [];

    const fields = await this.saveEditFormNodeFieldInput(step, workspaceSlug, step.id || dbStepId);

    return fields;
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
      const removedFields = findDifference(
        existingNode?.form?.steps.flatMap((step) => step.fields),
        input?.form?.steps?.flatMap((step) => step.fields) as any
      );

      // If fields are missing from input, remove the fields from database
      if (removedFields.length) {
        const stepsByGroupId = groupBy(removedFields, (field: any) => field.formNodeStepId);

        for (const [stepId, step] of Object.entries(stepsByGroupId)) {
          const mappedFields = step.map((field) => ({ id: field?.id?.toString() || '' }))
          await this.questionNodePrismaAdapter.removeStepFields(stepId, mappedFields);
        }
      }

      const removedSteps = findDifference(
        existingNode?.form?.steps,
        input?.form?.steps as any,
      );

      // If we removed fields, remove their steps as well from the database.
      if (removedSteps.length) {
        const mappedSteps = removedSteps.map((field) => ({ id: field?.id?.toString() || '' }))
        await this.questionNodePrismaAdapter.removeFormSteps(input.id, mappedSteps);
      }

      // If the related node has a form, save the step and form data for each step.
      if (existingNode?.form) {
        await Promise.all(input.form.steps?.map(async (step) => {
          if (!step) return;
          const stepData = await this.saveEditFormStepInput(step, existingNode?.form?.id as string);
          const upsertedStep = await this.questionNodePrismaAdapter.upsertFormNodeStep(stepData);
          const fields = await this.saveEditFormNodeInput(step, input.customerSlug, upsertedStep.id) || [];
          await Promise.all(fields.map((field) => this.questionNodePrismaAdapter.upsertFormNodeField(field)));
          return;
        }) || []);
        // TODO: Move this to a PrismaAdapter
        await this.prisma.formNode.update({
          where: {
            id: existingNode.form.id,
          },
          data: {
            preForm: {
              delete: (existingNode.form.preFormNodeId && !input.form.preFormNode) || false,
              upsert: input.form.preFormNode ? {
                create: {
                  header: input.form.preFormNode.header,
                  helper: input.form.preFormNode.helper,
                  nextText: input.form.preFormNode.nextText,
                  finishText: input.form.preFormNode.finishText,
                },
                update: {
                  header: input.form.preFormNode.header,
                  helper: input.form.preFormNode.helper,
                  nextText: input.form.preFormNode.nextText,
                  finishText: input.form.preFormNode.finishText,
                },
              } : undefined,
            },
          },
        })
      // Else, create a new form node with the relevant fields
      } else {
        const fields = await this.createFormNodeInput(input.form, input.customerSlug);
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
  */
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
  private async createFormNodeStepInput(
    input: FormNodeStepInput,
    workspaceSlug: string,
    contactIds: string[] = [],
  ): Promise<Prisma.FormNodeStepCreateInput> {
    let allUserIds = contactIds.map((contactId) => ({ id: contactId }));

    if (!allUserIds.length) {
      const communicationUser = input.fields?.find((field) => field.userIds?.length);
      const targetUsers = communicationUser?.userIds?.length
        ? await this.userOfCustomerPrismaAdapter.findTargetUsers(
          workspaceSlug,
          {
            roleIds: communicationUser?.userIds.filter(isPresent),
            userIds: communicationUser?.userIds.filter(isPresent),
          }
        )
        : [];
      allUserIds = targetUsers.map((user) => ({ id: user.userId }));
    }

    return ({
      header: input.header as string,
      helper: input.helper as string,
      subHelper: input.subHelper as string,
      position: input.position as number,
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
   * Save FormNodeInput when `creating`
   */
  public async createFormNodeInput(
    input: FormNodeInput,
    workspaceSlug: string,
    contactIds: string[] = [],
  ): Promise<Prisma.FormNodeCreateInput> {
    const steps = await Promise.all(input.steps?.map(
      async (step) => await this.createFormNodeStepInput(step, workspaceSlug, contactIds)
    ) as Promise<Prisma.FormNodeStepCreateInput>[])

    return ({
      helperText: input.helperText,
      preForm: {
        create: input.preFormNode ? {
          header: input.preFormNode?.header,
          helper: input.preFormNode?.helper,
          nextText: input.preFormNode?.nextText,
          finishText: input.preFormNode?.finishText,
        } : undefined,
      },
      steps: {
        create: steps,
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
    isLeaf: boolean = false,
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
    isLeaf: boolean = false,
    topic?: Prisma.TopicCreateInput,
  ) => {
    const qOptions = options.length > 0 ? options : [];
    const params: CreateQuestionInput = {
      isRoot,
      isLeaf,
      title,
      type,
      options: qOptions,
      overrideLeafId,
      dialogueId: questionnaireId,
      topic,
    };

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
    workspaceId: string,
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
    updateSameTemplate: boolean = false,
  ) => {
    const question = await this.questionNodePrismaAdapter.getDialogueBuilderNode(questionId) as FullQuestionNode;
    const edge = await this.edgeService.getEdgeById(edgeId || '-1') as any;

    // Find all questions in workspace with same template and topic
    const templateQuestionNodes = updateSameTemplate && question?.topic?.name && question.questionDialogue?.template
      ? await this.questionNodePrismaAdapter.getDialogueBuilderNodes(
        workspaceId,
        question.topic.name,
        question.questionDialogue?.template
      )
      : [question]

    // Find all edges in the workspace with the same template, and where its childnode matches the topic.
    const templateEdges = updateSameTemplate && question?.topic?.name
      ? await this.questionNodePrismaAdapter.findDialogueBuilderEdges(
        edge,
        question.topic.name,
        workspaceId
      )
      : [edge];

    const callToAction = overrideLeafId ? await this.findNodeById(overrideLeafId) : undefined;

    void await this.updateTemplateQuestionNodes(
      {
        id: questionId,
        title,
        type,
        extraContent: extraContent || undefined,
        happyText: happyText || undefined,
        sliderNode: sliderNode || { markers: [] },
        unhappyText: unhappyText || undefined,
      },
      questionId,
      templateQuestionNodes,
      overrideLeafId || '',
      callToAction?.title || '',
      options,
    );


    for (const templateEdge of templateEdges) {
      const existingEdgeCondition = templateEdge?.conditions && templateEdge.conditions[0];
      // Updating any question except root question should have this edge
      if (existingEdgeCondition) {
        try {
          await this.updateEdge(existingEdgeCondition, edgeCondition);
        } catch (e) {
        }
      };
    }

    return this.questionNodePrismaAdapter.findNodeById(questionId);
  };

  /**
   * Updates the template question nodes matching the `source` question node.
   *
   * @param sourceQuestionId - The `sourceQuestionId` is the question ID which was originally edited (
   * and triggers the entire template updating).
   * @param templateQuestionNodes - These are all the question nodes matching the "source".
   * @param overrideLeafName - The overrideCallToAction name of the source node.
   * @param optionInputs - Any potential new Options (created or updated.)
   */
  private async updateTemplateQuestionNodes(
    questionInput: SimpleQuestionInput,
    sourceQuestionId: string,
    templateQuestionNodes: FullQuestionNode[],
    sourceOverrideLeafId: string,
    sourceOverrideLeafName: string,
    optionInputs: QuestionOptionProps[],
  ) {
    // Loop over each template question-node, and update the connected relations.
    for (const templateQuestion of templateQuestionNodes) {
      const isSourceQuestion = templateQuestion.id === sourceQuestionId;
      const targetOptionIds = templateQuestion?.options?.map((option) => option.id) || [];

      let targetCallToAction: FullQuestionNode | undefined;

      // Fetch the override leaf if we have a name
      if (sourceOverrideLeafName) {
        targetCallToAction = await this.questionNodePrismaAdapter.findCTAByTopic(
          templateQuestion?.questionDialogueId as string,
          sourceOverrideLeafName
        ) || undefined;
      }

      /**
       * Find matching options in matching template question, and update its values and possibly related
       * call to aciton
       */
      const targetOptions = !isSourceQuestion ? await Promise.all(optionInputs.map(async (optionInput) => {
        let targetOptionCallToAction;

        /**
         * If our optionInput has an override CallToAction, fetch it,
         * and set the call-to-action of the template question to match
         * its "local template" version (meaning, grab the same CTA, but exclusive to that dialogue).
         */
        if (optionInput.overrideLeafId) {
          const sourceOptionCallToAction = optionInput.overrideLeafId
            ? await this.findNodeById(optionInput.overrideLeafId)
            : undefined;

          targetOptionCallToAction = sourceOptionCallToAction?.topic?.name
            ? await this.questionNodePrismaAdapter.findCTAByTopic(
              templateQuestion?.questionDialogueId as string,
              sourceOptionCallToAction?.topic?.name || ''
            )
            : undefined;
        }

        // Also grab target option
        const targetOption = templateQuestion?.options.find(
          (activeOption) => activeOption.value === optionInput.value
        ) as QuestionOptionProps;

        /**
         * If no target option exists, return an option with no source id
         */
        if (!targetOption) return {
          ...optionInput,
          id: undefined,
          overrideLeafId: targetOptionCallToAction?.id || undefined,
        };

        /**
         * Else, return the option with the same id, new option input, and a potentially new call-to-action.
         */
        return {
          ...optionInput,
          id: targetOption.id,
          overrideLeafId: targetOptionCallToAction?.id || undefined ,
        }
      }
      ).filter(isPresent)) : optionInputs;

      /**
       * Try removing question options if we have more than one template question node (so not just self).
       */
      try {
        await this.removeNonExistingQuestionOptions(
          targetOptionIds,
          templateQuestionNodes.length > 1 ? targetOptions : optionInputs
        );
      } catch (e) {};

      /**
       * If the template question has more template "clones", update potentially stale edge conditions.
       */
      await this.updateStaleEdgeConditions(
        templateQuestionNodes.length > 1 ? targetOptions : optionInputs,
        templateQuestion?.options,
        templateQuestion?.id
      );

      // Define the input for the question node itself
      const updateInput: UpdateQuestionInput = {
        title: questionInput.title,
        type: questionInput.type,
        options: templateQuestionNodes.length > 1 ? targetOptions: optionInputs,
        overrideLeafId: isSourceQuestion
          ? sourceOverrideLeafId || undefined
          : targetCallToAction?.id || undefined, // TODO: Add topic to all CTAs in templates
        videoEmbeddedNode: {
          id: templateQuestion?.videoEmbeddedNodeId || undefined,
        },
      };

      const updatedNode = await this.questionNodePrismaAdapter.updateDialogueBuilderNode(
        templateQuestion?.id as string,
        updateInput
      );

      if (questionInput.type === NodeType.VIDEO_EMBEDDED) {
        if (updatedNode?.videoEmbeddedNodeId) {
          await this.questionNodePrismaAdapter.updateVideoNode(updatedNode.videoEmbeddedNodeId, {
            videoUrl: questionInput.extraContent,
          });
        } else {
          await this.questionNodePrismaAdapter.createVideoNode({
            videoUrl: questionInput.extraContent,
            parentNodeId: questionInput.id,
          });
        }
      } else if (questionInput.type === NodeType.SLIDER) {
        if (updatedNode?.sliderNodeId) {
          await this.questionNodePrismaAdapter.updateSliderNode(updatedNode.sliderNodeId, {
            happyText: questionInput.happyText || null,
            unhappyText: questionInput.unhappyText || null,
            markers: questionInput.sliderNode?.markers?.filter(isPresent),
          });
        } else {
          await this.questionNodePrismaAdapter.createSliderNode({
            happyText: questionInput.happyText || null,
            unhappyText: questionInput.unhappyText || null,
            parentNodeId: questionInput.id,
            markers: questionInput.sliderNode?.markers?.filter(isPresent),
          });
        };
      };
    }
  }

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
