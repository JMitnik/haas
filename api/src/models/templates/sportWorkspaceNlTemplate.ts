import { LanguageEnum, NodeType } from '@prisma/client';
import WorkspaceTemplate, { defaultAdminRole, defaultBotRole, defaultForm, defaultManagerRole, defaultUserRole, DemoWorkspaceTemplate } from './TemplateTypes';

const sportOptionsNl = [
  { value: 'Lichaam & Geest', position: 1 },
  { value: 'Begeleiding', position: 2 },
  { value: 'Thuis', position: 3 },
  { value: 'School', position: 4 },
  { value: 'Teamgenoten', position: 5 },
  { value: 'Eigen Prestatie', position: 6 },
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
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 70,
            renderMax: 100,
          },
          options: sportOptionsNl,
          cta: null,
        },
        {
          title: 'Je bent niet helemaal tevreden dus. Wat kan er beter?',
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 55,
            renderMax: 70,
          },
          options: sportOptionsNl,
          cta: null,
        },
        {
          title: 'Wat vervelend! Wat is er aan de hand?',
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 25,
            renderMax: 55,
          },
          options: sportOptionsNl,
          cta: 'ContactFormNode',
        },
        {
          title: 'Wat vervelend! Wat is er aan de hand?',
          type: NodeType.CHOICE,
          edge: {
            conditionType: 'valueBoundary',
            matchValue: null,
            renderMin: 0,
            renderMax: 25,
          },
          options: sportOptionsNl,
          cta: 'ContactFormNode',
        },
      ],
    },
  ],
  title: 'Hoe gaat het met je?',
  slug: 'sport',
  language: LanguageEnum.DUTCH,
  rootLayer: ['Jongens', 'Meisjes'],
  subLayer: ['O8', 'O12', 'O16', 'O18'],
  subSubLayer: ['Team1', 'Team2', 'Team3'],
  topics: {
    'Lichaam & Geest': [],
    'Begeleiding': [],
    'Thuis': [],
    'School': [],
    'Teamgenoten': [],
    'Eigen Prestatie': [],
  },
  description: 'This is a default dialogue generated by the Haas sport NL template',
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
    subHeader: 'Sporten moet voldoening geven',
  },
  leafNodes: [
    {
      leafMatchId: 'ContactFormNode',
      title:
        'Jouw feedback blijft altijd anoniem, tenzij je er met iemand over wil praten. Als je dat wil, laat dan je email achter.',
      type: NodeType.FORM,
      form: defaultForm,
    },
  ],
};

export default sportWorkspaceTemplate;
