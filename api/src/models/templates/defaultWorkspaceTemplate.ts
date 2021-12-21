import { NexusGenInputs } from '../../generated/nexus';
import { NodeType, Prisma, TagEnum } from '@prisma/client';

interface Tag {
  name: string,
  type: TagEnum,
}

interface RootSliderOptions {
  markers: Prisma.SliderNodeMarkerCreateInput[];
}

export interface WorkspaceTemplate {
  title: string;
  slug: string;
  topics: string[];
  description: string;
  primaryColor: string;
  leafNodes: any;
  roles: Prisma.RoleCreateInput[];
  tags: Tag[];
  rootSliderOptions: any;
}

const defaultForm: NexusGenInputs['FormNodeInputType'] = {
  fields: [
    {
      isRequired: false,
      label: 'First name',
      type: 'shortText',
      position: 1,
    },
    {
      isRequired: false,
      label: 'Last name',
      type: 'shortText',
      position: 1,
    },
    {
      isRequired: false,
      label: 'Email',
      type: 'email',
      position: 1,
    },
  ],
};

const defaultLinks: any[] = [
  { url: 'https://facebook.com', type: 'FACEBOOK', backgroundColor: '#1877f2' },
  { url: 'https://twitter.com', type: 'TWITTER', backgroundColor: '#1da1f2' },
  { url: 'https://instagram.com', type: 'INSTAGRAM', backgroundColor: '#c32aa3' },
  { url: 'https://linkedin.com', type: 'LINKEDIN', backgroundColor: '#007bb5' },
];

export const defaultAdminRole: Prisma.RoleCreateInput = {
  name: 'Admin',
  type: 'ADMIN',
  isPrivate: true,
  permissions: {
    set: [
      'CAN_VIEW_USERS',
      'CAN_ADD_USERS',
      'CAN_BUILD_DIALOGUE',
      'CAN_CREATE_TRIGGERS',
      'CAN_DELETE_DIALOGUE',
      'CAN_DELETE_TRIGGERS',
      'CAN_EDIT_DIALOGUE',
      'CAN_EDIT_USERS',
      'CAN_DELETE_USERS',
      'CAN_DELETE_WORKSPACE',
      'CAN_EDIT_WORKSPACE',
      'CAN_VIEW_DIALOGUE',
      'CAN_VIEW_DIALOGUE_ANALYTICS',
    ],
  },
}

export const defaultManagerRole: Prisma.RoleCreateInput = {
  name: 'Manager',
  type: 'MANAGER',
  permissions: {
    set: [
      'CAN_VIEW_USERS',
      'CAN_ADD_USERS',
      'CAN_BUILD_DIALOGUE',
      'CAN_CREATE_TRIGGERS',
      'CAN_DELETE_DIALOGUE',
      'CAN_DELETE_TRIGGERS',
      'CAN_EDIT_DIALOGUE',
      'CAN_EDIT_WORKSPACE',
      'CAN_VIEW_DIALOGUE',
      'CAN_VIEW_DIALOGUE_ANALYTICS',
    ],
  },
  isPrivate: false,
};

export const defaultUserRole: Prisma.RoleCreateInput = {
  name: 'User',
  type: 'USER',
  permissions: {
    set: [
      'CAN_VIEW_DIALOGUE',
      'CAN_VIEW_DIALOGUE_ANALYTICS',
      'CAN_VIEW_USERS',
    ],
  },
};

export const defaultBotRole: Prisma.RoleCreateInput = {
  name: 'Bot',
  type: 'BOT',
  permissions: {
    set: [
      'CAN_ACCESS_REPORT_PAGE',
    ],
  },
};

const defaultWorkspaceTemplate: WorkspaceTemplate = {
  title: 'How do you feel about us?',
  slug: 'default',
  topics: ['Facilities', 'Website/Mobile app', 'Product/Services', 'Customer support'],
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
