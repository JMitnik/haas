import { FormNodeStepType, LanguageEnum, Link, NodeType, Prisma, TagEnum } from 'prisma/prisma-client';
import { NexusGenInputs } from '../../generated/nexus';

export interface Tag {
  name: string;
  type: TagEnum;
}

export interface RootSliderOptions {
  markers: Prisma.SliderNodeMarkerCreateInput[];
}

export interface QuestionTemplateInput {
  title: string;
  type: NodeType;
  topic?: Prisma.TopicCreateInput;
  isRoot?: boolean;
  cta?: string | null;
  edge?: {
    conditionType: string;
    matchValue: string | null;
    renderMin: number | null;
    renderMax: number | null;
  } | null;
  options: {
    value: string;
    position: number;
    isTopic?: boolean;
    topic?: string;
    cta?: string | null;
  }[];
  children?: QuestionTemplateInput[];
}

export interface WorkspaceTemplate {
  structure?: QuestionTemplateInput[];
  title: string;
  slug: string;
  language?: LanguageEnum;
  topics: { [K in any]: string[] };
  description: string;
  primaryColor: string;
  leafNodes: any;
  roles: Prisma.RoleCreateInput[];
  tags: Tag[];
  rootSliderOptions: {
    markers: any[];
    happyText?: string;
    unhappyText?: string;
  };
  postLeafText?: {
    header: string;
    subHeader: string;
  };
}

export interface DemoWorkspaceTemplate extends WorkspaceTemplate {
  rootLayer: string[];
  subLayer: string[];
  subSubLayer: string[];
  language: LanguageEnum;
}

export const defaultStudentTextFieldForm: NexusGenInputs['FormNodeInputType'] = {
  preFormNode: {
    header: 'We are sorry to hear that.',
    helper: 'Click next to find out who you can talk to about this. Click finish to end the survey.',
    nextText: 'Next',
    finishText: 'Finish',
  },
  steps: [
    {
      header: 'Your Choice',
      helper: 'Let us get you in touch with the right person.',
      subHelper: '',
      position: 1,
      type: FormNodeStepType.GENERIC_FIELDS,
      fields: [
        {
          type: 'email',
          position: 1,
          isRequired: true,
          label: 'Leave your email address and a School Counselor will contact you ⇣',
        },
        {
          type: 'contacts',
          position: 2,
          isRequired: false,
          label: 'Contacts',
        },
      ],
    },
  ],
}

export const defaultTeacherTextFieldForm: NexusGenInputs['FormNodeInputType'] = {
  preFormNode: {
    header: 'We are sorry to hear that.',
    helper: 'Click next to find out who you can talk to about this. Click finish to end the survey.',
    nextText: 'Next',
    finishText: 'Finish',
  },
  steps: [
    {
      header: 'Your Choice',
      helper: 'We would love to get you in touch with the right person.',
      subHelper: 'Please select with whom you would prefer to discuss your issue',
      position: 1,
      type: FormNodeStepType.GENERIC_FIELDS,
      fields: [
        {
          type: 'email',
          position: 1,
          isRequired: true,
          label: 'Leave your email address and a Paraprofessional will contact you ⇣',
        },
        {
          type: 'contacts',
          position: 2,
          isRequired: false,
          label: 'Contacts',
        },
      ],
    },
  ],
}


export const defaultSportTextFieldForm: NexusGenInputs['FormNodeInputType'] = {
  preFormNode: {
    header: 'We are sorry to hear that.',
    helper: 'Click next to find out who you can talk to about this. Click finish to end the survey.',
    nextText: 'Next',
    finishText: 'Finish',
  },
  steps: [
    {
      header: 'Your Choice',
      helper: 'We would love to get you in touch with the right person.',
      subHelper: 'Please select with whom you would prefer to discuss your issue',
      position: 1,
      type: FormNodeStepType.GENERIC_FIELDS,
      fields: [
        {
          type: 'email',
          position: 1,
          isRequired: true,
          label: 'Email',
        },
        {
          type: 'contacts',
          position: 2,
          isRequired: false,
          label: 'Contacts',
        },
      ],
    },
  ],
}

export const defaultBusinessTextFieldForm: NexusGenInputs['FormNodeInputType'] = {
  preFormNode: {
    header: 'We\'re sorry to hear that.',
    helper: 'Click next to find out who you can talk to about this. Click finish to end the survey.',
    nextText: 'Next',
    finishText: 'Finish',
  },
  steps: [
    {
      header: 'Your Choice',
      helper: 'We would love to get you in touch with the right person.',
      subHelper: 'Please select with whom you would prefer to discuss your issue',
      position: 1,
      type: FormNodeStepType.GENERIC_FIELDS,
      fields: [
        {
          type: 'email',
          position: 1,
          isRequired: true,
          label: 'Email',
        },
        {
          type: 'contacts',
          position: 2,
          isRequired: false,
          label: 'Contacts',
        },
      ],
    },
  ],
}

export const defaultForm: NexusGenInputs['FormNodeInputType'] = {
  preFormNode: {
    header: 'Wat vervelend om te horen.',
    helper: 'Klik op volgende om erachter te komen met wie je kan praten. Klik op afronden om de survey te beindigen.',
    nextText: 'Volgende',
    finishText: 'Afronden',
  },
  steps: [
    {
      header: 'Jouw Keuze',
      helper: 'We zouden je graag in contact brengen met de juiste persoon.',
      subHelper: 'Selecteer met wie je jouw probleem zou willen bespreken alsjeblieft',
      position: 1,
      type: FormNodeStepType.GENERIC_FIELDS,
      fields: [
        {
          type: 'email',
          position: 1,
          isRequired: true,
          label: 'Email',
        },
        {
          type: 'contacts',
          position: 2,
          isRequired: false,
          label: 'Contacten',
        },
      ],
    },
  ],
};

export const singleLink: Partial<Link>[] = [
  {
    url: 'https://www.haas.live/',
    type: 'SINGLE',
    header: 'Join the stanford summer program',
    subHeader: 'Get the best out of yourself with our 30-day fit program!',
    imageUrl: 'https://res.cloudinary.com/haas-storage/image/upload/v1655796025/sellable_items/aa6h8testdtftgy9m3bk.png',
  },
]

export const defaultLinks: any[] = [
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
      'CAN_CREATE_AUTOMATIONS',
      'CAN_UPDATE_AUTOMATIONS',
      'CAN_VIEW_AUTOMATIONS',
      'CAN_ACCESS_REPORT_PAGE',
      'CAN_DOWNLOAD_REPORTS',
      'CAN_ACCESS_ALL_DIALOGUES',
      'CAN_ACCESS_ALL_ACTION_REQUESTS',
      'CAN_VIEW_ACTION_REQUESTS',
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
      'CAN_RESET_WORKSPACE_DATA',
      'CAN_ASSIGN_USERS_TO_DIALOGUE',
      'CAN_GENERATE_WORKSPACE_FROM_CSV',
    ],
  },
}

export const defaultManagerRole: Prisma.RoleCreateInput = {
  name: 'Manager',
  type: 'MANAGER',
  permissions: {
    set: [
      'CAN_VIEW_ACTION_REQUESTS',
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

export default WorkspaceTemplate;
