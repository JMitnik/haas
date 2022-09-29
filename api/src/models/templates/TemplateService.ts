import { DialogueTemplateType, NodeType, PrismaClient, QuestionNode, Prisma } from 'prisma/prisma-client';

import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { NexusGenEnums } from '../../generated/nexus';
import { LeafNodeDataEntryProps } from '../QuestionNode/NodeServiceType';
import templates from '.';
import EdgeService from '../edge/EdgeService';
import NodeService from '../QuestionNode/NodeService';
import WorkspaceTemplate, { QuestionTemplateInput } from './TemplateTypes';

const standardOptions = [
  { value: 'Facilities', position: 1 },
  { value: 'Website/Mobile app', position: 2 },
  { value: 'Product/Services', position: 3 },
  { value: 'Customer Support', position: 4 },
];

const businessOptions = [
  { value: 'Physical & Mental', position: 1 },
  { value: 'Management', position: 2 },
  { value: 'Home Situation', position: 3 },
  { value: 'Colleagues', position: 4 },
  { value: 'Performance', position: 5 },
  { value: 'Work Pressure', position: 6 },
  { value: 'Company Leadership', position: 7 },
];

const studentOptions = [
  { value: 'Physical & Mental', position: 1 },
  { value: 'Teacher', position: 2 },
  { value: 'Home', position: 3 },
  { value: 'Activity Outside School', position: 4 },
  { value: 'Classmates', position: 5 },
  { value: 'School Performance', position: 6 },
];

const teacherOptions = [
  { value: 'Physical & Mental', position: 1 },
  { value: 'Students', position: 2 },
  { value: 'Home', position: 3 },
  { value: 'Work Pressure', position: 4 },
  { value: 'Colleagues', position: 5 },
  { value: 'Own Performance', position: 6 },
]

const yesNoOptions = [
  { value: 'Yes', position: 1, isTopic: false },
  { value: 'No', position: 2, isTopic: false },
]

const sportOptionsEng = [
  { value: 'Physical & Mental', position: 1 },
  { value: 'Coaching', position: 2 },
  { value: 'Home', position: 3 },
  { value: 'School', position: 4 },
  { value: 'Team Members', position: 5 },
  { value: 'Own Performance', position: 6 },
];

const studentOptionsNl = [
  { value: 'Lichaam & Geest', position: 1 },
  { value: 'Leraren', position: 2 },
  { value: 'Thuis', position: 3 },
  { value: 'Activiteiten buiten school / hobby', position: 4 },
  { value: 'Klasgenoten', position: 5 },
  { value: 'Eigen Prestatie', position: 6 },
]

const teacherOptionsNl = [
  { value: 'Lichaam & Geest', position: 1 },
  { value: 'Management', position: 2 },
  { value: 'Thuis', position: 3 },
  { value: 'Activiteit buiten school / Hobby', position: 4 },
  { value: 'Collega\'s', position: 5 },
  { value: 'Eigen Prestatie / Werkdruk', position: 6 },
]

const sportOptionsNl = [
  { value: 'Lichaam & Geest', position: 1 },
  { value: 'Begeleiding', position: 2 },
  { value: 'Thuis', position: 3 },
  { value: 'School', position: 4 },
  { value: 'Teamgenoten', position: 5 },
  { value: 'Eigen Prestatie', position: 6 },
]

const facilityOptions = [
  { value: 'Cleanliness', position: 1 },
  { value: 'Atmosphere', position: 2 },
  { value: 'Location', position: 3 },
  { value: 'Other', position: 4 },
];

const websiteOptions = [
  { value: 'Design', position: 1 },
  { value: 'Functionality', position: 2 },
  { value: 'Informative', position: 3 },
  { value: 'Other', position: 4 },
];

const customerSupportOptions = [
  { value: 'Friendliness', position: 1 },
  { value: 'Competence', position: 2 },
  { value: 'Speed', position: 3 },
  { value: 'Other', position: 4 },
];

const productServicesOptions = [
  { value: 'Quality', position: 1 },
  { value: 'Price', position: 2 },
  { value: 'Friendliness', position: 3 },
  { value: 'Other', position: 4 },
];


class TemplateService {
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  edgeService: EdgeService;
  nodeService: NodeService;
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.prisma = prismaClient;
  };

  /**
   * Finds a template based on template type
   * @param templateType
   * @returns
   */
  findTemplate = (templateType: DialogueTemplateType): WorkspaceTemplate => {
    switch (templateType) {
      case DialogueTemplateType.STUDENT_NL:
        return templates.studentNl;
      case DialogueTemplateType.TEACHER_NL:
        return templates.teacherNl;
      case DialogueTemplateType.STUDENT_ENG:
        return templates.student;
      case DialogueTemplateType.TEACHER_ENG:
        return templates.teacher;
      case DialogueTemplateType.BUSINESS_ENG:
        return templates.business;
      case DialogueTemplateType.SPORT_ENG:
        return templates.sportEng;
      case DialogueTemplateType.SPORT_NL:
        return templates.sportNl;
      case DialogueTemplateType.DEFAULT:
        return templates.default;
      default:
        return templates.default;
    }
  };

  /**
   * Finds Template CTA nodes based on template type
   * @param templateType
   * @returns
   */
  findTemplateLeadNodes = (templateType: NexusGenEnums['DialogueTemplateType']): LeafNodeDataEntryProps[] => {
    switch (templateType) {
      case DialogueTemplateType.STUDENT_NL:
        return templates.studentNl.leafNodes;
      case DialogueTemplateType.TEACHER_NL:
        return templates.teacherNl.leafNodes;
      case DialogueTemplateType.TEACHER_ENG:
        return templates.teacher.leafNodes;
      case DialogueTemplateType.STUDENT_ENG:
        return templates.student.leafNodes;
      case DialogueTemplateType.BUSINESS_ENG:
        return templates.business.leafNodes;
      case DialogueTemplateType.SPORT_ENG:
        return templates.sportEng.leafNodes;
      case DialogueTemplateType.SPORT_NL:
        return templates.sportNl.leafNodes;
      case DialogueTemplateType.MASS_SEED:
        return templates.massSeed.leafNodes;
      case DialogueTemplateType.DEFAULT:
        return templates.default.leafNodes;
      default:
        return templates.default.leafNodes;
    }
  };

  /**
   * Creates a post leaf node based on template type and whether content for the node is specified.
   * If not, default settings are used
   * @param templateType
   * @param dialogueId
   */
  createTemplatePostLeafNode = async (
    template: WorkspaceTemplate,
    dialogueId: string,
  ) => {
    if (!template.postLeafText) return;

    await this.dialoguePrismaAdapter.createPostLeafNode(dialogueId, template.postLeafText);
  }

  /**
   * Create template call-to-actions.
   * */
  createTemplateLeafNodes = async (
    templateType: NexusGenEnums['DialogueTemplateType'],
    dialogueId: string,
    contactIds: string[] = [],
  ) => {
    const leafNodesArray = this.findTemplateLeadNodes(templateType);

    // Create build input for leaf nodes
    const createLeafsBuildInput = await Promise.all(leafNodesArray.map(async (leaf) => {
      const form = leaf.form
        ? await this.nodeService.createFormNodeInput(leaf?.form, '', contactIds || [])
        : undefined;

      return {
        ...leaf,
        topic: leaf.leafMatchId ? {
          connectOrCreate: {
            create: {
              name: leaf.leafMatchId,
            },
            where: {
              name: leaf.leafMatchId,
            },
          },
        } : undefined,
        title: leaf.title as string,
        type: leaf.type,
        dialogueId: dialogueId,
        isRoot: false,
        isLeaf: true,
        form: form as Required<Prisma.FormNodeCreateInput>,
      }
    }));

    const nodes = await this.dialoguePrismaAdapter.createNodes(dialogueId, createLeafsBuildInput as any);
    const leafNodes = nodes.filter((node) => node.isLeaf);

    return leafNodes;
  };

  /**
   * Find a call-to-action containing text.
   */
  static findLeafIdContainingText = (leafs: QuestionNode[], titleSubset: string) => {
    const correctLeaf = leafs.find((leaf) => leaf.title.includes(titleSubset));
    return correctLeaf?.id;
  };

  /**
   * Creates a set of nodes based on the provided template type
   * @param dialogueId - Dialogue ID
   * @param workspaceName - Workspace name
   * @param leafs - Leaf nodes
   * @param templateType - Type of the template
   */
  createTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
    templateType: string
  ) => {
    switch (templateType) {
      case DialogueTemplateType.STUDENT_NL:
        return this.createStudentNlTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.TEACHER_NL:
        return this.createTeacherNlTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.STUDENT_ENG:
        return this.createStudentEngTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.TEACHER_ENG:
        return this.createTeacherEngTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.BUSINESS_ENG:
        return this.createBusinessTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.SPORT_ENG:
        return this.createSportTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.SPORT_NL:
        return this.createSportNlTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.MASS_SEED:
        return this.createDefaultTemplateNodes(dialogueId, workspaceName, leafs);
      case DialogueTemplateType.DEFAULT:
        return this.createDefaultTemplateNodes(dialogueId, workspaceName, leafs);
      default:
        return this.createDefaultTemplateNodes(dialogueId, workspaceName, leafs);
    };
  };

  /**
   * Create nodes from a default template.
   */
  createTeacherNlTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'Hoe gaat het met je?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.teacherNl.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'met iemand over wil praten');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    const greatToHear = await this.nodeService.createQuestionNode(
      'Fijn om te horen! Waar ben je het meest tevreden over?', dialogueId, NodeType.CHOICE, teacherOptionsNl, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'Je bent niet helemaal tevreden dus. Wat kan er beter?', dialogueId, NodeType.CHOICE, teacherOptionsNl, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'Wat vervelend! Wat is er aan de hand?', dialogueId, NodeType.CHOICE,
      teacherOptionsNl, false, hrWillContactCTA,
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'Wat vervelend! Wat is er aan de hand?', dialogueId,
      NodeType.CHOICE, teacherOptionsNl, false, hrWillContactCTA
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, greatToHear,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, notCompletelySatisfied,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 55, renderMax: 70 });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, negative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 25, renderMax: 55 });

    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });
  };

  /**
   * Recursively sets up the structure of a dialogue based on provided template
   * @param template
   * @param parentNode
   * @param structure
   * @param dialogueId
   * @param leafs
   */
  createDialogueStructure = async (
    template: WorkspaceTemplate,
    parentNode: QuestionNode | null,
    structure: QuestionTemplateInput[],
    dialogueId: string,
    leafs: QuestionNode[],
  ) => {
    for (const questionInput of structure) {
      let cta: string | undefined;
      if (questionInput.cta) {
        const inputLeaf = template.leafNodes.find((leaf: any) => leaf.leafMatchId === questionInput.cta);
        const dbLeaf = leafs.find((leaf) => leaf.title === inputLeaf.title);
        cta = dbLeaf?.id || undefined;
      }

      const includeTopicOptions = questionInput.options.map((option) => ({ ...option, isTopic: true })) || [];

      const question = await this.nodeService.createQuestionNode(
        questionInput.title,
        dialogueId,
        questionInput.type,
        includeTopicOptions,
        questionInput.isRoot || false,
        cta,
        undefined,
        questionInput.topic,
      );

      if (question.type === NodeType.SLIDER) {
        const { markers, happyText, unhappyText } = template.rootSliderOptions;
        if (markers.length || happyText || unhappyText) {
          await this.nodeService.createSliderNode({
            markers,
            happyText: happyText || null,
            unhappyText: unhappyText || null,
            parentNodeId: question.id,
          });
        }
      }

      if (questionInput.edge && parentNode) {
        await this.edgeService.createEdge(
          parentNode,
          question,
          questionInput.edge
        );
      }

      if (questionInput.children?.length) {
        await this.createDialogueStructure(template, question, questionInput.children, dialogueId, leafs);
      }
    }
  }

  /**
  * Create nodes from a default template.
  */
  createStudentNlTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'Hoe gaat het met je?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.studentNl.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'met iemand over wil praten');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    const greatToHear = await this.nodeService.createQuestionNode(
      'Fijn om te horen! Waar ben je het meest tevreden over?', dialogueId, NodeType.CHOICE, studentOptionsNl, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'Je bent niet helemaal tevreden dus. Wat kan er beter?', dialogueId, NodeType.CHOICE, studentOptionsNl, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'Wat vervelend! Wat is er aan de hand?', dialogueId, NodeType.CHOICE,
      studentOptionsNl, false, hrWillContactCTA,
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'Wat vervelend! Wat is er aan de hand?', dialogueId,
      NodeType.CHOICE, studentOptionsNl, false, hrWillContactCTA
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, greatToHear,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, notCompletelySatisfied,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 55, renderMax: 70 });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, negative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 25, renderMax: 55 });

    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });
  };

  /**
   * Create nodes from a default template.
   * */
  createSportNlTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'Hoe gaat het met je?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.sportNl.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'met iemand over wil praten');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    const greatToHear = await this.nodeService.createQuestionNode(
      'Fijn om te horen! Waar ben je het meest tevreden over?', dialogueId, NodeType.CHOICE, sportOptionsNl, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'Je bent niet helemaal tevreden dus. Wat kan er beter?', dialogueId, NodeType.CHOICE, sportOptionsNl, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'Wat vervelend! Wat is er aan de hand?', dialogueId, NodeType.CHOICE,
      sportOptionsNl, false, hrWillContactCTA,
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'Wat vervelend! Wat is er aan de hand?', dialogueId,
      NodeType.CHOICE, sportOptionsNl, false, hrWillContactCTA
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, greatToHear,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, notCompletelySatisfied,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 55, renderMax: 70 });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, negative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 25, renderMax: 55 });

    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });
  };

  /**
   * Create nodes from a default template.
   * */
  createSportTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'How are you feeling?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.sportEng.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'unless you want to talk to someone');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const greatToHear = await this.nodeService.createQuestionNode(
      'What\'s going well?', dialogueId, NodeType.CHOICE, sportOptionsEng, false);

    // Positive Sub child 2
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'What\'s going well, but can be improved?', dialogueId, NodeType.CHOICE, sportOptionsEng, false, hrWillContactCTA);

    // Negative Sub child 3
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const negative = await this.nodeService.createQuestionNode(
      'What went wrong?', dialogueId, NodeType.CHOICE, sportOptionsEng, false, hrWillContactCTA
    );

    // Very Negative Sub child 4
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const veryNegative = await this.nodeService.createQuestionNode(
      'What went wrong?', dialogueId, NodeType.CHOICE, sportOptionsEng, false, hrWillContactCTA
    );
  };

  /**
 * Create nodes from a default template.
 * */
  createTeacherEngTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'How are you feeling?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.teacher.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'will always remain anonymous');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    const greatToHear = await this.nodeService.createQuestionNode(
      'What\'s going well?', dialogueId, NodeType.CHOICE, teacherOptions, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'What\'s going well, but can be improved?', dialogueId, NodeType.CHOICE, teacherOptions, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'What is bothering you?', dialogueId, NodeType.CHOICE, teacherOptions
    );

    const mappedYesNoOptions = yesNoOptions.map((option) => ({ ...option, overrideLeafId: option.value === 'Yes' ? hrWillContactCTA : undefined }))

    const negativeDiscussWith1 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const negativeDiscussWith2 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const negativeDiscussWith3 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const negativeDiscussWith4 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const negativeDiscussWith5 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const negativeDiscussWith6 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'What is bothering you?', dialogueId,
      NodeType.CHOICE, teacherOptions,
    );

    const veryNegativeDiscussWith1 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const veryNegativeDiscussWith2 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const veryNegativeDiscussWith3 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const veryNegativeDiscussWith4 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const veryNegativeDiscussWith5 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    const veryNegativeDiscussWith6 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, greatToHear,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, notCompletelySatisfied,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 55, renderMax: 70 });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, negative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 25, renderMax: 55 });

    await this.edgeService.createEdge(negative, negativeDiscussWith1,
      { conditionType: 'match', matchValue: 'Physical & Mental', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith2,
      { conditionType: 'match', matchValue: 'Students', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith3,
      { conditionType: 'match', matchValue: 'Home', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith4,
      { conditionType: 'match', matchValue: 'Work Pressure', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith5,
      { conditionType: 'match', matchValue: 'Colleagues', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith6,
      { conditionType: 'match', matchValue: 'Own Performance', renderMin: null, renderMax: null });


    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });

    await this.edgeService.createEdge(veryNegative, veryNegativeDiscussWith1,
      { conditionType: 'match', matchValue: 'Physical & Mental', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, veryNegativeDiscussWith2,
      { conditionType: 'match', matchValue: 'Students', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, veryNegativeDiscussWith3,
      { conditionType: 'match', matchValue: 'Home', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, veryNegativeDiscussWith4,
      { conditionType: 'match', matchValue: 'Work Pressure', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, veryNegativeDiscussWith5,
      { conditionType: 'match', matchValue: 'Colleagues', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, veryNegativeDiscussWith6,
      { conditionType: 'match', matchValue: 'Own Performance', renderMin: null, renderMax: null });


  };

  /**
 * Create nodes from a default template.
 * */
  createStudentEngTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'How are you feeling?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.student.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'will always remain anonymous');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    const greatToHear = await this.nodeService.createQuestionNode(
      'What\'s going well?', dialogueId, NodeType.CHOICE, studentOptions, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'What\'s going well, but can be improved?', dialogueId, NodeType.CHOICE, studentOptions, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'What is bothering you?', dialogueId, NodeType.CHOICE, studentOptions, false, hrWillContactCTA
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'What is bothering you?', dialogueId,
      NodeType.CHOICE, studentOptions, false, hrWillContactCTA
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, greatToHear,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, notCompletelySatisfied,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 55, renderMax: 70 });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, negative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 25, renderMax: 55 });

    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });

  };


  /**
 * Create nodes from a default template.
 * */
  createBusinessTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      'How are you doing?',
      dialogueId, NodeType.SLIDER, [], true,
    );

    const { markers, happyText, unhappyText } = templates.business.rootSliderOptions;
    if (markers.length || happyText || unhappyText) {
      await this.nodeService.createSliderNode({
        markers,
        happyText: happyText || null,
        unhappyText: unhappyText || null,
        parentNodeId: rootQuestion.id,
      });
    }

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'will always remain anonymous');

    // Very Positive Sub child 1 (Great to hear! What are you most satisfied about?)
    const greatToHear = await this.nodeService.createQuestionNode(
      'Great to hear! What are you most satisfied about?', dialogueId, NodeType.CHOICE, businessOptions, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'You\'re not completely satisfied. What can be improved?', dialogueId, NodeType.CHOICE, businessOptions, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'That\'s unfortunate! What went wrong?', dialogueId, NodeType.CHOICE, businessOptions, false, hrWillContactCTA
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'That\'s unfortunate! What went wrong?', dialogueId,
      NodeType.CHOICE, businessOptions, false, hrWillContactCTA
    );

    // ################################### EDGES ################################

    // Positive edges
    await this.edgeService.createEdge(rootQuestion, greatToHear,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    // Neutral edges
    await this.edgeService.createEdge(rootQuestion, notCompletelySatisfied,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 55, renderMax: 70 });

    // Negative edges
    await this.edgeService.createEdge(rootQuestion, negative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 25, renderMax: 55 });

    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });

  };

  /**
   * Create nodes from a default template.
   * */
  createDefaultTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await this.nodeService.createQuestionNode(
      `How do you feel about ${workspaceName}?`,
      dialogueId, NodeType.SLIDER, standardOptions, true,
    );

    // Positive Sub child 1 (What did you like?)
    const singleLinkCTAId = TemplateService.findLeafIdContainingText(leafs, 'Single link CTA');
    const rootToWhatDidYou = await this.nodeService.createQuestionNode(
      'What did you like?', dialogueId, NodeType.CHOICE, standardOptions, false,
      singleLinkCTAId,
    );

    // Positive Sub sub child 1 (Facilities)
    const whatDidYouToFacilities = await this.nodeService.createQuestionNode(
      'What exactly did you like about the facilities?', dialogueId,
      NodeType.CHOICE, facilityOptions, false, undefined,
    );

    // Positive Sub sub child 2 (Website)
    const whatDidYouToWebsite = await this.nodeService.createQuestionNode(
      'What exactly did you like about the website?', dialogueId,
      NodeType.CHOICE, websiteOptions, false, undefined,
    );

    // Positive Sub sub child 3 (Product/Services)
    const shareCTA = TemplateService.findLeafIdContainingText(
      leafs,
      'Share CTA',
    );

    const whatDidYouToProduct = await this.nodeService.createQuestionNode(
      'What exactly did you like about the product / services?',
      dialogueId,
      NodeType.CHOICE,
      productServicesOptions,
      false,
      shareCTA,
    );

    // Positive Sub sub child 4 (Customer Support)
    const InstagramMultiLinkCTA = TemplateService.findLeafIdContainingText(leafs,
      'Instagram');
    const whatDidYouToCustomerSupport = await this.nodeService.createQuestionNode(
      'What exactly did you like about the customer support?', dialogueId,
      NodeType.CHOICE,
      [
        { value: 'Friendliness', position: 1 },
        { value: 'Competence', position: 2 },
        { value: 'Speed', position: 3 },
        { value: 'Other', position: 4, overrideLeafId: InstagramMultiLinkCTA },
      ], false, undefined,
    );

    // Neutral Sub child 2
    const leaveYourEmailBelowToReceive = TemplateService.findLeafIdContainingText(leafs,
      'Leave your email below to receive our');
    const rootToWhatWouldYouLikeToTalkAbout = await this.nodeService.createQuestionNode(
      'What would you like to talk about?', dialogueId, NodeType.CHOICE,
      standardOptions, false, leaveYourEmailBelowToReceive,
    );

    // Neutral Sub sub child 1 (Facilities)
    const whatWouldYouLikeToTalkAboutToFacilities = await this.nodeService.createQuestionNode('Please specify.',
      dialogueId, NodeType.CHOICE, facilityOptions);

    // Neutral Sub sub child 2 (Website)
    const whatWouldYouLikeToTalkAboutToWebsite = await this.nodeService.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, websiteOptions,
    );

    // Neutral Sub sub child 3 (Product/Services)
    const whatWouldYouLikeToTalkAboutToProduct = await this.nodeService.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, productServicesOptions,
    );

    // Neutral Sub sub child 4 (Customer Support)
    const whatWouldYouLikeToTalkAboutToCustomerSupport = await this.nodeService.createQuestionNode(
      'Please specify.', dialogueId, NodeType.CHOICE, customerSupportOptions,
    );

    // Negative Sub child 3
    const rootToWeAreSorryToHearThat = await this.nodeService.createQuestionNode(
      'We are sorry to hear that! Where can we improve?', dialogueId,
      NodeType.CHOICE, standardOptions,
    );

    // Negative Sub sub child 1 (Facilities)
    const ourTeamIsOnIt = TemplateService.findLeafIdContainingText(leafs, 'Our team is on it');
    const weAreSorryToHearThatToFacilities = await this.nodeService.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, facilityOptions, false, ourTeamIsOnIt,
    );

    // Negative Sub sub child 2 (Website)
    const pleaseClickWhatsappLink = TemplateService.findLeafIdContainingText(leafs,
      'Please click on the Whatsapp link below so our service');
    const weAreSorryToHearThatToWebsite = await this.nodeService.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, websiteOptions,
      false, pleaseClickWhatsappLink,
    );

    // Negative Sub sub child 3 (Product/Services)
    const clickBelowForRefund = TemplateService.findLeafIdContainingText(leafs, 'Click below for your refund');
    const weAreSorryToHearThatToProduct = await this.nodeService.createQuestionNode(
      'Please elaborate.', dialogueId, NodeType.CHOICE, productServicesOptions,
      false, clickBelowForRefund,
    );

    // Negative Sub sub child 4 (Customer Support)
    const ourCustomerExperienceSupervisor = TemplateService.findLeafIdContainingText(leafs,
      'Our customer experience supervisor is');
    const weAreSorryToHearThatToCustomerSupport = await this.nodeService.createQuestionNode(
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
    }
    );

    await this.edgeService.createEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToCustomerSupport, {
      conditionType: 'match',
      matchValue: 'Customer Support',
      renderMin: null,
      renderMax: null,
    }
    );

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
    }
    );
  };


};

export default TemplateService;
