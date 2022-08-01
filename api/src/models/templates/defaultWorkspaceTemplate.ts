import { LanguageEnum, NodeType, Prisma } from '@prisma/client';
import WorkspaceTemplate, { Tag, defaultAdminRole, defaultBotRole, defaultForm, defaultLinks, defaultManagerRole, defaultUserRole, DemoWorkspaceTemplate, singleLink } from './TemplateTypes';

export type rootTopics = 'Facilities' | 'Website/Mobile app' | 'Product/Services' | 'Customer Support'

export interface MassSeedTemplate extends WorkspaceTemplate {
  title: string;
  slug: string;
  topics: { [K in any]: string[] };
  description: string;
  primaryColor: string;
  leafNodes: any;
  roles: Prisma.RoleCreateInput[];
  tags: Tag[];
  rootSliderOptions: any;
}

/**
 * Single Link CTA: Positive path => Website => Any option
 * Share CTA (Also to test overriding CTA as single link CTA is set on layer above): Positive path => Product/Services => Any option
 * Form CTA: Neutral path => any option => any option
 * Multi Link CTA: Positive path => Customer support => Other (It is set on question option instead of on question)
 */
const defaultWorkspaceTemplate: DemoWorkspaceTemplate = {
  title: 'How do you feel about us?',
  slug: 'default',
  language: LanguageEnum.ENGLISH,
  rootLayer: ['default'],
  subLayer: [''],
  subSubLayer: [''],
  topics: {
    'Facilities': ['Cleanliness', 'Atmosphere', 'Location'],
    'Website/Mobile app': ['Design', 'Functionality', 'Informative'],
    'Product/Services': ['Friendliness', 'Price', 'Quality'],
    'Customer Support': ['Competence', 'Speed', 'Friendliness'],
  },
  description: 'This is a default dialogue generated by the Haas template',
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
      title: 'Share CTA',
      type: NodeType.SHARE,
      share: {
        title: 'Get a discount for your friend',
        url: 'https://www.haas.live/',
        tooltip: 'Share',
      },
    },
    {
      title: 'Single link CTA',
      type: NodeType.LINK,
      links: singleLink,
    },
    {
      title: 'Thank you for your elaborate feedback. Kindly appreciated!',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your feedback on our facilities. We hope to see you soon again!',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your feedback on our website. We hope to hear from you again!',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your positive feedback. Follow us on Instagram or other social media and stay updated.',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your positive feedback. Come and join us on 1st April for our great event. Leave your email address below to register.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Would you like to say anything else?',
      type: NodeType.TEXTBOX,
      links: [],
    },
    {
      title:
        'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. You matter to us! Leave your email below to receive our newsletter.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title: 'Thank you! Leave your email below to subscribe to our newsletter.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Our customer experience supervisor is informed. Please leave your email below so we can solve the issue.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. You matter to us! Click below for your refund.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Please click on the Whatsapp link below so our service team can fix the issue.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Our team is on it. If you leave your email below we will keep you updated.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you! Please leave your contact details below so we can reach out to you with a solution.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
  ],
};

export const defaultMassSeedTemplate: DemoWorkspaceTemplate = {
  title: 'How do you feel about us?',
  slug: 'default',
  language: LanguageEnum.ENGLISH,
  topics: {
    'Facilities': ['Cleanliness', 'Atmosphere', 'Location'],
    'Website/Mobile app': ['Design', 'Functionality', 'Informative'],
    'Product/Services': ['Friendliness', 'Price', 'Quality'],
    'Customer Support': ['Competence', 'Speed', 'Friendliness'],
  },
  rootLayer: ['How do you feel about us?'],
  subLayer: [],
  subSubLayer: [],
  description: 'This is a default dialogue generated by the Haas template',
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
    markers: [
      {
        label: 'Good!',
        subLabel: 'This is good.',
        range: { create: { start: 6, end: 9.5 } },
      },
      {
        label: 'Amazing!',
        subLabel: 'This is excellent.',
        range: { create: { start: 9.5 } },
      },
      {
        label: 'Neutral!',
        subLabel: 'Something is not great.',
        range: { create: { start: 5, end: 6 } },
      },
      {
        label: 'Bad',
        subLabel: 'This is bad.',
        range: { create: { start: 3, end: 5 } },
      },
      {
        label: 'Terrible',
        subLabel: 'This is terrible',
        range: { create: { end: 3 } },
      },
    ],
  },
  leafNodes: [
    {
      title:
        'We are happy about your positive feedback. You matter to us! Leave your contact details below to receive our newsletter.',
      type: NodeType.TEXTBOX,
      links: [],
    },
    {
      title: 'Thank you for your elaborate feedback. Kindly appreciated!',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your feedback on our facilities. We hope to see you soon again!',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your feedback on our website. We hope to hear from you again!',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your positive feedback. Follow us on Instagram and stay updated.',
      type: NodeType.LINK,
      links: defaultLinks,
    },
    {
      title:
        'Thank you for your positive feedback. Come and join us on 1st April for our great event. Leave your email address below to register.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Would you like to say anything else?',
      type: NodeType.TEXTBOX,
      links: [],
    },
    {
      title:
        'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. You matter to us! Leave your email below to receive our newsletter.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title: 'Thank you! Leave your email below to subscribe to our newsletter.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Our customer experience supervisor is informed. Please leave your email below so we can solve the issue.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. You matter to us! Click below for your refund.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Please click on the Whatsapp link below so our service team can fix the issue.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you for your feedback. Our team is on it. If you leave your email below we will keep you updated.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
    {
      title:
        'Thank you! Please leave your contact details below so we can reach out to you with a solution.',
      type: NodeType.FORM,
      form: defaultForm,
      links: [],
    },
  ],
};

export default defaultWorkspaceTemplate;
