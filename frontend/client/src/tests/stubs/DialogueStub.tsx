/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
import { CustomerFragmentFragment, EdgeCondition, EdgeFragmentFragment, GetDialogueQuery, QuestionFragmentFragment, QuestionNodeTypeEnum } from 'generated/graphql';

// 0. Define all readable-identifiers
const QuestionIds = [
  '0-SLIDER',
  '1-POSITIVE',
  '2-POSITIVE-TOPIC-A',
  '2-POSITIVE-TOPIC-B',
  '2-POSITIVE-TOPIC-C',
  '2-POSITIVE-TOPIC-D',
  '1-NEUTRAL',
  '2-NEUTRAL-TOPIC-A',
  '2-NEUTRAL-TOPIC-B',
  '2-NEUTRAL-TOPIC-C',
  '2-NEUTRAL-TOPIC-D',
  '1-NEGATIVE',
  '2-NEGATIVE-TOPIC-A',
  '2-NEGATIVE-TOPIC-B',
  '2-NEGATIVE-TOPIC-C',
  '2-NEGATIVE-TOPIC-D',
] as const;

// 1. Define all leafs, each with some readable-identifier.
const LeafIds = [
  'CTA-OPINION',
  'CTA-SHARE',
  'CTA-TEXTBOX',
  'CTA-LINK',
] as const;

// 1b. Define all topics, each with some readable-identifier.
const Topics = [
  'Application',
  'Business',
  'Car-performance',
  'Delivery',
] as const;

interface BasicQuestionNode {
  id: typeof QuestionIds[number];
  title: string;
  type: QuestionNodeTypeEnum;
  leafId?: typeof LeafIds[number];
}

interface BasicEdgeNode {
  childNodeId: typeof QuestionIds[number];
  condition: EdgeCondition;
}

interface ParentChildren {
  parentNodeId: typeof QuestionIds[number];
  childrenNodes: BasicEdgeNode[];
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

// 2. Define all nodes, each with some readable-identifier (unique)
const QuestionNodes: BasicQuestionNode[] = [
  { id: '0-SLIDER', title: 'How do you feel?', type: QuestionNodeTypeEnum.Slider },
    { id: '1-POSITIVE', title: 'Why good?', type: QuestionNodeTypeEnum.Choice, leafId: 'CTA-LINK' },
      { id: '2-POSITIVE-TOPIC-A', title: 'Why good about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-POSITIVE-TOPIC-B', title: 'Why good about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-POSITIVE-TOPIC-C', title: 'Why good about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-POSITIVE-TOPIC-D', title: 'Why good about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
    { id: '1-NEUTRAL', title: 'Why neutral?', type: QuestionNodeTypeEnum.Choice, leafId: 'CTA-OPINION' },
      { id: '2-NEUTRAL-TOPIC-A', title: 'Why neutral about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-NEUTRAL-TOPIC-B', title: 'Why neutral about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-NEUTRAL-TOPIC-C', title: 'Why neutral about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-NEUTRAL-TOPIC-D', title: 'Why neutral about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
    { id: '1-NEGATIVE', title: 'Why negative?', type: QuestionNodeTypeEnum.Choice, leafId: 'CTA-TEXTBOX' },
      { id: '2-NEGATIVE-TOPIC-A', title: 'Why negative about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-NEGATIVE-TOPIC-B', title: 'Why negative about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-NEGATIVE-TOPIC-C', title: 'Why negative about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
      { id: '2-NEGATIVE-TOPIC-D', title: 'Why negative about [[topic]]?', type: QuestionNodeTypeEnum.Choice },
];

// 3. Define for each topic
const AllParentChildren: ParentChildren[] = [
  { parentNodeId: '0-SLIDER',
    childrenNodes: [
      { childNodeId: '1-POSITIVE', condition: { id: getRandomInt(100000), conditionType: 'valueBoundary', renderMin: 60, renderMax: 100 } },
      { childNodeId: '1-NEUTRAL', condition: { id: getRandomInt(100000), conditionType: 'valueBoundary', renderMin: 40, renderMax: 60 } },
      { childNodeId: '1-NEGATIVE', condition: { id: getRandomInt(100000), conditionType: 'valueBoundary', renderMin: 0, renderMax: 40 } },
    ] },
  { parentNodeId: '1-POSITIVE',
    childrenNodes: [
      { childNodeId: '2-POSITIVE-TOPIC-A', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Application' } },
      { childNodeId: '2-POSITIVE-TOPIC-B', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Business' } },
      { childNodeId: '2-POSITIVE-TOPIC-C', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Car-performance' } },
      { childNodeId: '2-POSITIVE-TOPIC-D', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Delivery' } },
    ] },
  { parentNodeId: '1-NEUTRAL',
    childrenNodes: [
      { childNodeId: '2-NEUTRAL-TOPIC-A', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Application' } },
      { childNodeId: '2-NEUTRAL-TOPIC-B', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Business' } },
      { childNodeId: '2-NEUTRAL-TOPIC-C', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Car-performance' } },
      { childNodeId: '2-NEUTRAL-TOPIC-D', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Delivery' } },
    ] },
  { parentNodeId: '1-NEGATIVE',
    childrenNodes: [
      { childNodeId: '2-NEGATIVE-TOPIC-A', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Application' } },
      { childNodeId: '2-NEGATIVE-TOPIC-B', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Business' } },
      { childNodeId: '2-NEGATIVE-TOPIC-C', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Car-performance' } },
      { childNodeId: '2-NEGATIVE-TOPIC-D', condition: { id: getRandomInt(100000), conditionType: 'match', matchValue: 'Delivery' } },
    ] },
];

const rootNode = QuestionNodes[0];

const flattenParentChildrenToEdges = (parentChildren: ParentChildren): EdgeFragmentFragment[] => parentChildren.childrenNodes.map((child) => ({
  __typename: 'Edge',
  id: `${parentChildren.parentNodeId}-${child.childNodeId}`,
  parentNodeId: parentChildren.parentNodeId,
  conditions: [{ __typename: 'EdgeCondition', ...child.condition }],
  childNodeId: child.childNodeId,
  childNode: {
    __typename: 'QuestionNode',
    id: child.childNodeId,
  },
  parentNode: {
    __typename: 'QuestionNode',
    id: parentChildren.parentNodeId,
  },
}));

const getEdgesFromNode = (node: BasicQuestionNode): EdgeFragmentFragment[] => {
  const edges = AllParentChildren.find((edge) => edge.parentNodeId === node.id)?.childrenNodes;

  if (!edges?.length) return [];

  return edges.map((edge) => ({
    __typename: 'Edge',
    id: `${node.id}-${edge.childNodeId}`,
    conditions: [{
      __typename: 'EdgeCondition', matchValue: '', renderMax: 0, renderMin: 0, ...edge.condition,
    }],
    childNode: {
      __typename: 'QuestionNode',
      id: edge.childNodeId,
    },
    parentNode: {
      __typename: 'QuestionNode',
      id: node.id,
    },
  }));
};

const mapBasicQuestionToReal = (questionNode: BasicQuestionNode): QuestionFragmentFragment => ({
  __typename: 'QuestionNode',
  id: questionNode.id,
  isLeaf: false,
  isRoot: questionNode.id.includes('0'),
  options: questionNode.type === QuestionNodeTypeEnum.Choice ? Topics.map((topic) => ({
    id: getRandomInt(1000000), value: topic, __typename: 'QuestionOption', questionId: '', publicValue: '',
  })) : [],
  overrideLeaf: null,
  title: questionNode.title,
  type: questionNode.type,
  children: getEdgesFromNode(questionNode),
});

export const CustomerStub: CustomerFragmentFragment = {
  __typename: 'Customer',
  id: 'test',
  name: 'Test',
  slug: 'test',
  settings: {
    id: '21312312',
    __typename: 'CustomerSettings',
    logoUrl: 'https://test123.com',
    colourSettings: {
      __typename: 'ColourSettings',
      id: 'asdasd',
      primary: '#000',
    },
  },
};

export const CustomerWithDialogueStub: GetDialogueQuery = {
  customer: {
    __typename: 'Customer',
    id: 'test',
    dialogue: {
      __typename: 'Dialogue',
      creationDate: null,
      updatedAt: null,
      publicTitle: '',
      id: '',
      questions: QuestionNodes.map((node) => mapBasicQuestionToReal(node)),
      edges: AllParentChildren.map((parentChild) => flattenParentChildrenToEdges(parentChild)).flat(),
      leafs: [],
      rootQuestion: {
        ...rootNode,
        __typename: 'QuestionNode',
        id: '0-SLIDER',
        isRoot: true,
        isLeaf: false,
        children: [],
        options: [],
      },
      customer: CustomerStub,
      customerId: '',
      title: 'How do you feel about Organization X?',
      slug: 'org-x',
    },
  },
};

export default CustomerWithDialogueStub;
