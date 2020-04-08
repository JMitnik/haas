import { prisma, LeafNode, NodeType } from '../../generated/prisma-client/index';
import { sliderType, multiChoiceType } from '../../../data/seeds/seedDataStructure';
import EdgeResolver from '../edge/edge-resolver';

interface LeafNodeDataEntryProps {
  title: string;
  type?: NodeType;
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
  static constructQuestionNode = async (
    title: string,
    questionnaireId: string,
    type: NodeType,
    options: Array<any> = [],
    isRoot: boolean = false,
    overrideLeafId: string = '') => prisma.createQuestionNode({
    title,
    questionnaire: {
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
    options: {
      create: options.length > 0 ? [
        ...options,
      ] : [],
    },
  });

  static createTemplateLeafNodes = async (leafNodesArray: Array<LeafNodeDataEntryProps>) => {
    const leafs = await Promise.all(leafNodesArray.map(async (leafNode) => prisma.createLeafNode({
      title: leafNode.title,
      type: leafNode?.type,
    })));

    return leafs;
  };

  static getCorrectLeaf = (leafs: LeafNode[], titleSubset: string) => {
    const correctLeaf = leafs.find((leaf) => leaf.title.includes(titleSubset));
    return correctLeaf?.id;
  };

  static createTemplateNodes = async (
    questionnaireId: string,
    customerName: string,
    leafs: LeafNode[],
  ) => {
    // Root question (How do you feel about?)
    const rootQuestion = await NodeResolver.constructQuestionNode(`How do you feel about ${customerName}?`, questionnaireId, sliderType, standardOptions, true);

    // Positive Sub child 1 (What did you like?)
    const instagramNodeId = NodeResolver.getCorrectLeaf(leafs, 'Follow us on Instagram and stay');
    const rootToWhatDidYou = await NodeResolver.constructQuestionNode(
      'What did you like?', questionnaireId, multiChoiceType, standardOptions, false,
      instagramNodeId,
    );

    // Positive Sub sub child 1 (Facilities)
    const comeAndJoin1stAprilId = NodeResolver.getCorrectLeaf(leafs,
      'Come and join us on 1st April for our great event');
    const whatDidYouToFacilities = await NodeResolver.constructQuestionNode(
      'What exactly did you like about the facilities?', questionnaireId,
      multiChoiceType, facilityOptions, false, comeAndJoin1stAprilId,
    );

    // Positive Sub sub child 2 (Website)
    const whatDidYouToWebsite = await NodeResolver.constructQuestionNode(
      'What exactly did you like about the website?', questionnaireId,
      multiChoiceType, websiteOptions, false, instagramNodeId,
    );

    // Positive Sub sub child 3 (Product/Services)
    const weThinkYouMightLikeThis = NodeResolver.getCorrectLeaf(leafs,
      'We think you might like this as');
    const whatDidYouToProduct = await NodeResolver.constructQuestionNode(
      'What exactly did you like about the product / services?', questionnaireId,
      multiChoiceType, productServicesOptions, false, weThinkYouMightLikeThis,
    );

    // Positive Sub sub child 4 (Customer Support)
    const yourEmailBelowForNewsletter = NodeResolver.getCorrectLeaf(leafs,
      'your email below to receive our newsletter');
    await NodeResolver.constructQuestionNode(
      'What exactly did you like about the customer support?', questionnaireId,
      multiChoiceType, customerSupportOptions, false, yourEmailBelowForNewsletter,
    );

    // Neutral Sub child 2
    const leaveYourEmailBelowToReceive = NodeResolver.getCorrectLeaf(leafs,
      'Leave your email below to receive our');
    const rootToWhatWouldYouLikeToTalkAbout = await NodeResolver.constructQuestionNode(
      'What would you like to talk about?', questionnaireId, multiChoiceType,
      standardOptions, false, leaveYourEmailBelowToReceive,
    );

    // Neutral Sub sub child 1 (Facilities)
    await NodeResolver.constructQuestionNode('Please specify.',
      questionnaireId, multiChoiceType, facilityOptions);

    // Neutral Sub sub child 2 (Website)
    const whatWouldYouLikeToTalkAboutToWebsite = await NodeResolver.constructQuestionNode(
      'Please specify.', questionnaireId, multiChoiceType, websiteOptions,
    );

    // Neutral Sub sub child 3 (Product/Services)
    const whatWouldYouLikeToTalkAboutToProduct = await NodeResolver.constructQuestionNode(
      'Please specify.', questionnaireId, multiChoiceType, productServicesOptions,
    );

    // Neutral Sub sub child 4 (Customer Support)
    const whatWouldYouLikeToTalkAboutToCustomerSupport = await NodeResolver.constructQuestionNode(
      'Please specify.', questionnaireId, multiChoiceType, customerSupportOptions,
    );

    // Negative Sub child 3
    const rootToWeAreSorryToHearThat = await NodeResolver.constructQuestionNode(
      'We are sorry to hear that! Where can we improve?', questionnaireId,
      multiChoiceType, standardOptions,
    );

    // Negative Sub sub child 1 (Facilities)
    const ourTeamIsOnIt = NodeResolver.getCorrectLeaf(leafs, 'Our team is on it');
    const weAreSorryToHearThatToFacilities = await NodeResolver.constructQuestionNode(
      'Please elaborate.', questionnaireId, multiChoiceType, facilityOptions, false, ourTeamIsOnIt,
    );

    // Negative Sub sub child 2 (Website)
    const pleaseClickWhatsappLink = NodeResolver.getCorrectLeaf(leafs,
      'Please click on the Whatsapp link below so our service');
    const weAreSorryToHearThatToWebsite = await NodeResolver.constructQuestionNode(
      'Please elaborate.', questionnaireId, multiChoiceType, websiteOptions,
      false, pleaseClickWhatsappLink,
    );

    // Negative Sub sub child 3 (Product/Services)
    const clickBelowForRefund = NodeResolver.getCorrectLeaf(leafs, 'Click below for your refund');
    const weAreSorryToHearThatToProduct = await NodeResolver.constructQuestionNode(
      'Please elaborate.', questionnaireId, multiChoiceType, productServicesOptions,
      false, clickBelowForRefund,
    );

    // Negative Sub sub child 4 (Customer Support)
    const ourCustomerExperienceSupervisor = NodeResolver.getCorrectLeaf(leafs,
      'Our customer experience supervisor is');
    const weAreSorryToHearThatToCustomerSupport = await NodeResolver.constructQuestionNode(
      'Please elaborate', questionnaireId, multiChoiceType, customerSupportOptions,
      false, ourCustomerExperienceSupervisor,
    );

    // ################################### EDGES ################################

    // Positive edges
    await EdgeResolver.constructEdge(rootQuestion, rootToWhatDidYou,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 70, renderMax: 100 });

    await EdgeResolver.constructEdge(rootToWhatDidYou, whatDidYouToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await EdgeResolver.constructEdge(rootToWhatDidYou, whatDidYouToWebsite,
      { conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null });

    await EdgeResolver.constructEdge(rootToWhatDidYou, whatDidYouToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMin: null, renderMax: null });

    await EdgeResolver.constructEdge(rootToWhatDidYou, whatDidYouToProduct,
      { conditionType: 'match', matchValue: 'Customer Support', renderMin: null, renderMax: null });

    // Neutral edges
    await EdgeResolver.constructEdge(rootQuestion, rootToWhatWouldYouLikeToTalkAbout,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 50, renderMax: 70 });

    await EdgeResolver.constructEdge(rootToWhatWouldYouLikeToTalkAbout, whatDidYouToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMin: null, renderMax: null });

    await EdgeResolver.constructEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToWebsite,
      { conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null });

    await EdgeResolver.constructEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToProduct, { conditionType: 'match',
        matchValue: 'Product/Services',
        renderMin: null,
        renderMax: null });

    await EdgeResolver.constructEdge(rootToWhatWouldYouLikeToTalkAbout,
      whatWouldYouLikeToTalkAboutToCustomerSupport, { conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null });

    // Negative edges
    await EdgeResolver.constructEdge(rootQuestion, rootToWeAreSorryToHearThat,
      { conditionType: 'valueBoundary', matchValue: null, renderMin: 0, renderMax: 50 });

    await EdgeResolver.constructEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToFacilities,
      { conditionType: 'match', matchValue: 'Facilities', renderMax: null, renderMin: null });

    await EdgeResolver.constructEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToWebsite,
      { conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMax: null,
        renderMin: null });

    await EdgeResolver.constructEdge(rootToWeAreSorryToHearThat, weAreSorryToHearThatToProduct,
      { conditionType: 'match', matchValue: 'Product/Services', renderMax: null, renderMin: null });

    await EdgeResolver.constructEdge(rootToWeAreSorryToHearThat,
      weAreSorryToHearThatToCustomerSupport, { conditionType: 'match',
        matchValue: 'Customer Support',
        renderMax: null,
        renderMin: null });
  };
}

export default NodeResolver;
