import { NodeType, PrismaClient, QuestionNode } from '@prisma/client';

import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { NexusGenEnums } from '../../generated/nexus';
import { DialogueTemplateType, LeafNodeDataEntryProps } from '../QuestionNode/NodeServiceType';
import templates from '.';
import { CreateQuestionsInput } from '../questionnaire/DialoguePrismaAdapterType';
import EdgeService from '../edge/EdgeService';
import NodeService from '../QuestionNode/NodeService';
import WorkspaceTemplate, { DemoWorkspaceTemplate } from './TemplateTypes';

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

const yesNoOptions = [
  { value: 'Yes', position: 1 }, // TODO: Add isTopic: false to both entries so they won't be shown in top topics
  { value: 'No', position: 2 },
]

const sportOptionsEng = [
  { value: 'Physical & Mental', position: 1 },
  { value: 'Coaching', position: 2 },
  { value: 'Home', position: 3 },
  { value: 'School', position: 4 },
  { value: 'Team Members', position: 5 },
  { value: 'Own Performance', position: 6 },
];

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

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.edgeService = new EdgeService(prismaClient);
    this.nodeService = new NodeService(prismaClient);
  };

  findTemplate = (templateType: NexusGenEnums['DialogueTemplateType']): WorkspaceTemplate => {
    switch (templateType) {
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

  findTemplateLeadNodes = (templateType: NexusGenEnums['DialogueTemplateType']): LeafNodeDataEntryProps[] => {
    switch (templateType) {
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
    templateType: NexusGenEnums['DialogueTemplateType'],
    dialogueId: string,
  ) => {
    const template = this.findTemplate(templateType);
    if (!template.postLeafText) return;

    await this.dialoguePrismaAdapter.createPostLeafNode(dialogueId, template.postLeafText);
  }

  /**
   * Create template call-to-actions.
   * */
  createTemplateLeafNodes = async (
    templateType: NexusGenEnums['DialogueTemplateType'],
    dialogueId: string,
  ) => {
    const leafNodesArray = this.findTemplateLeadNodes(templateType);
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
        },
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
   * Creates a set of nodes based on the provided template type
   * @param dialogueId
   * @param workspaceName
   * @param leafs
   * @param templateType
   * @returns
   */
  createTemplateNodes = async (
    dialogueId: string,
    workspaceName: string,
    leafs: QuestionNode[],
    templateType: string
  ) => {
    switch (templateType) {
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

    const hrWillContactCTA = TemplateService.findLeafIdContainingText(leafs, 'laat dan je naam');

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
    const greatToHear = await this.nodeService.createQuestionNode(
      'What\'s going well?', dialogueId, NodeType.CHOICE, sportOptionsEng, false);

    // Positive Sub child 2
    const notCompletelySatisfied = await this.nodeService.createQuestionNode(
      'What\'s going well, but can be improved?', dialogueId, NodeType.CHOICE, sportOptionsEng, false);

    // Negative Sub child 3
    const negative = await this.nodeService.createQuestionNode(
      'What went wrong?', dialogueId, NodeType.CHOICE,
      sportOptionsEng, false, hrWillContactCTA,
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'What went wrong?', dialogueId,
      NodeType.CHOICE, sportOptionsEng, false, hrWillContactCTA
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
      'That\'s unfortunate! What went wrong?', dialogueId, NodeType.CHOICE,
      businessOptions, false, hrWillContactCTA,
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

    const negativeDiscussWith7 = await this.nodeService.createQuestionNode(
      'Would you like to discuss this with someone?', dialogueId, NodeType.CHOICE, mappedYesNoOptions,
    );

    // Very Negative Sub child 4
    const veryNegative = await this.nodeService.createQuestionNode(
      'That\'s unfortunate! What went wrong?', dialogueId,
      NodeType.CHOICE, businessOptions, false, hrWillContactCTA
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

    const veryNegativeDiscussWith7 = await this.nodeService.createQuestionNode(
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

    // const businessOptions = [
    //   { value: 'Physical & Mental', position: 1 },
    //   { value: 'Management', position: 2 },
    //   { value: 'Home Situation', position: 3 },
    //   { value: 'Colleagues', position: 4 },
    //   { value: 'Performance', position: 5 },
    //   { value: 'Work Pressure', position: 6 },
    //   { value: 'Company Leadership', position: 7 },
    // ];  

    await this.edgeService.createEdge(negative, negativeDiscussWith1,
      { conditionType: 'match', matchValue: 'Physical & Mental', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith2,
      { conditionType: 'match', matchValue: 'Management', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith3,
      { conditionType: 'match', matchValue: 'Home Situation', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith4,
      { conditionType: 'match', matchValue: 'Colleagues', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith5,
      { conditionType: 'match', matchValue: 'Performance', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith6,
      { conditionType: 'match', matchValue: 'Work Pressure', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(negative, negativeDiscussWith7,
      { conditionType: 'match', matchValue: 'Company Leadership', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(rootQuestion, veryNegative,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 25 });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith1,
      { conditionType: 'match', matchValue: 'Physical & Mental', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith2,
      { conditionType: 'match', matchValue: 'Management', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith3,
      { conditionType: 'match', matchValue: 'Home Situation', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith4,
      { conditionType: 'match', matchValue: 'Colleagues', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith5,
      { conditionType: 'match', matchValue: 'Performance', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith6,
      { conditionType: 'match', matchValue: 'Work Pressure', renderMin: null, renderMax: null });

    await this.edgeService.createEdge(veryNegative, negativeDiscussWith7,
      { conditionType: 'match', matchValue: 'Company Leadership', renderMin: null, renderMax: null });

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


};

export default TemplateService;
