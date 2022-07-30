import { LanguageEnum, Link, Prisma, TagEnum } from '@prisma/client';
import { NexusGenInputs } from '../../generated/nexus';

export interface Tag {
  name: string;
  type: TagEnum;
}

export interface RootSliderOptions {
  markers: Prisma.SliderNodeMarkerCreateInput[];
}

export interface WorkspaceTemplate {
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

export const defaultSportTextFieldForm: NexusGenInputs['FormNodeInputType'] = {
  fields: [
    {
      type: 'email',
      isRequired: true,
      label: 'Leave your email address and a senior leader will contact you ⇣',
    },
  ],
}

export const defaultBusinessTextFieldForm: NexusGenInputs['FormNodeInputType'] = {
  fields: [
    {
      type: 'email',
      isRequired: true,
      label: 'Leave your email address and a senior leader will contact you ⇣',
    },
  ],
}

export const defaultForm: NexusGenInputs['FormNodeInputType'] = {
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
      isRequired: true,
      label: 'Email',
      type: 'email',
      position: 1,
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
