import { LanguageEnum, NodeType } from 'prisma/prisma-client';
import { defaultAdminRole, defaultBotRole, defaultForm, defaultManagerRole, defaultUserRole, DemoWorkspaceTemplate } from './TemplateTypes';

const studentOptionsNl = [
  { value: 'Lichaam & Geest', position: 1, topic: 'Physical & Mental' },
  { value: 'Leraren', position: 2, topic: 'Teacher' },
  { value: 'Thuis', position: 3, topic: 'Home' },
  { value: 'Activiteiten buiten school / hobby', position: 4, topic: 'Activity Outside School' },
  { value: 'Klasgenoten', position: 5, topic: 'Classmates' },
  { value: 'Eigen Prestatie', position: 6, topic: 'Own Performance' },
]

const sportWorkspaceTemplate: DemoWorkspaceTemplate = {
  structure: [
    {
      title: 'Hoe gaat het met je?',
      isRoot: true,
      type: NodeType.SLIDER,
      edge: null,
      options: [],
      children: [
        {
          title: 'Fijn om te horen! Waar ben je het meest tevreden over?',
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
          options: studentOptionsNl,
          cta: null,
        },
        {
          title: 'Je bent niet helemaal tevreden dus. Wat kan er beter?',
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
          options: studentOptionsNl,
          cta: null,
        },
        {
          title: 'Wat vervelend! Wat is er aan de hand?',
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
          options: studentOptionsNl,
          cta: 'ContactFormNode',
        },
        {
          title: 'Wat vervelend! Wat is er aan de hand?',
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
          options: studentOptionsNl,
          cta: 'ContactFormNode',
        },
      ],
    },
  ],
  title: 'Hoe gaat het met je?',
  slug: 'sport',
  language: LanguageEnum.DUTCH,
  rootLayer: ['VMBOT', 'HAVO', 'VWO'],
  subLayer: ['1e klas', '2e klas', '3e klas'],
  subSubLayer: ['A', 'B', 'C'],
  topics: {
    'Lichaam & Geest': [],
    'Leraren': [],
    'Thuis': [],
    'Activiteiten buiten school / hobby': [],
    'Klasenoten': [],
    'Eigen Prestatie': [],
  },
  description: 'This is a default dialogue generated by the Haas student NL template',
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
  rootSliderOptions: {
    unhappyText: 'Slecht',
    happyText: 'Goed',
    markers: [
      {
        label: 'Goed!',
        subLabel: 'Ik voel me goed.',
        range: { start: 6, end: 9.5 },
      },
      {
        label: 'Geweldig!',
        subLabel: 'Ik voel me geweldig.',
        range: { start: 9.5 },
      },
      {
        label: 'Neutraal!',
        subLabel: 'Ik voel me oke.',
        range: { start: 5, end: 6 },
      },
      {
        label: 'Slecht',
        subLabel: 'Ik voel me slecht.',
        range: { start: 3, end: 5 },
      },
      {
        label: 'Heel slecht',
        subLabel: 'Ik voel me heel slecht.',
        range: { end: 3 },
      },
    ],
  },
  postLeafText: {
    header: 'Dankjewel voor je feedback!',
    subHeader: 'Leven moet voldoening geven',
  },
  leafNodes: [
    {
      leafMatchId: 'ContactFormNode',
      title:
        'Jouw feedback blijft altijd anoniem, tenzij je er met iemand over wil praten. Als je dat wil, laat dan je gegevens achter.',
      type: NodeType.FORM,
      form: defaultForm,
    },
  ],
};

export default sportWorkspaceTemplate;
