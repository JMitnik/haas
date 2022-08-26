import { LanguageEnum, NodeType } from '@prisma/client';
import { defaultAdminRole, defaultBotRole, defaultManagerRole, defaultSportTextFieldForm, defaultStudentTextFieldForm, defaultUserRole, DemoWorkspaceTemplate } from './TemplateTypes';

const studentOptions = [
  { value: 'Physical & Mental', position: 1 },
  { value: 'Teacher', position: 2 },
  { value: 'Home', position: 3 },
  { value: 'Activity Outside School', position: 4 },
  { value: 'Classmates', position: 5 },
  { value: 'School Performance', position: 6 },
];

const studentWorkspaceTemplate: DemoWorkspaceTemplate = {
  structure: [
    {
      title: 'How are you feeling?',
      isRoot: true,
      type: NodeType.SLIDER,
      edge: null,
      options: [],
      children: [
        {
          title: 'What\'s going well?',
          topic: {
            name: 'VERY_POSITIVE',
          },
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 70,
            renderMax: 100,
          },
          options: studentOptions,
          cta: null,
        },
        {
          title: 'What\'s going well, but can be improved?',
          topic: {
            name: 'POSITIVE',
          },
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 55,
            renderMax: 70,
          },
          options: studentOptions,
          cta: null,
        },
        {
          title: 'What is bothering you?',
          topic: {
            name: 'NEGATIVE',
          },
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 25,
            renderMax: 55,
          },
          options: studentOptions,
          cta: 'ContactFormNode',
        },
        {
          title: 'What is bothering you?',
          topic: {
            name: 'VERY_NEGATIVE',
          },
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 0,
            renderMax: 25,
          },
          options: studentOptions,
          cta: 'ContactFormNode',
        },
      ],
    },
  ],
  title: 'How do you feel about us?',
  slug: 'sport',
  language: LanguageEnum.ENGLISH,
  rootLayer: ['9th Grade', '10th Grade', '11th Grade', '12th Grade'],
  subLayer: ['Class 1', 'Class 2', 'Class 3'],
  subSubLayer: [],
  topics: {
    'Physical & Mental': [],
    'Teacher': [],
    'Home': [],
    'Activity Outside School': [],
    'Classmates': [],
    'School Performance': [],
  },
  description: 'This is a default dialogue generated by the Haas student template',
  primaryColor: '#667EEA',
  tags: [
    {
      name: 'Agent',
      type: 'AGENT',
    },
    {
      name: 'Amsterdam',
      type: 'LOCATION',
    },
    {
      name: 'Standard survey',
      type: 'DEFAULT',
    },
  ],
  roles: [
    defaultAdminRole,
    defaultManagerRole,
    defaultUserRole,
    defaultBotRole,
  ],
  postLeafText: {
    header: 'Thank you for your input!',
    subHeader: 'Work should be fulfilling',
  },
  rootSliderOptions: {
    markers: [
      {
        label: 'Good!',
        subLabel: 'I\'m feeling good.',
        range: { start: 6, end: 9.5 },
      },
      {
        label: 'Amazing!',
        subLabel: 'I\'m feeling amazing.',
        range: { start: 9.5 },
      },
      {
        label: 'Neutral!',
        subLabel: 'I could feel better.',
        range: { start: 5, end: 6 },
      },
      {
        label: 'Bad',
        subLabel: 'I\'m feeling bad.',
        range: { start: 3, end: 5 },
      },
      {
        label: 'Terrible',
        subLabel: 'I\'m feeling terrible.',
        range: { end: 3 },
      },
    ],
  },
  leafNodes: [
    {
      leafMatchId: 'ContactFormNode',
      title:
        'Your feedback will always remain anonymous, unless you want to talk to someone.',
      type: NodeType.FORM,
      form: defaultStudentTextFieldForm,
    },
  ],
};

export default studentWorkspaceTemplate;
