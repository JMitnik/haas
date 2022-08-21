import { LanguageEnum, NodeType } from '@prisma/client';
import { defaultAdminRole, defaultBotRole, defaultManagerRole, defaultSportTextFieldForm, defaultTeacherTextFieldForm, defaultUserRole, DemoWorkspaceTemplate } from './TemplateTypes';

const teacherWorkspaceTemplate: DemoWorkspaceTemplate = {
  title: 'How do you feel about us?',
  slug: 'sport',
  language: LanguageEnum.ENGLISH,
  rootLayer: ['Teachers'],
  subLayer: ['All Teachers'],
  subSubLayer: [],
  topics: {
    'Physical & Mental': [],
    'Students': [],
    'Home': [],
    'Work Pressure': [],
    'Colleagues': [],
    'Own Performance': [],
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
      title:
        'Your feedback will always remain anonymous, unless you want to talk to someone.',
      type: NodeType.FORM,
      form: defaultTeacherTextFieldForm,
    },
  ],
};

export default teacherWorkspaceTemplate;