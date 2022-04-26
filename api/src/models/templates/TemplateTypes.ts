import { Prisma, TagEnum } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

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
  topics: string[];
  description: string;
  primaryColor: string;
  leafNodes: any;
  roles: Prisma.RoleCreateInput[];
  tags: Tag[];
  rootSliderOptions: any;
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
      isRequired: false,
      label: 'Email',
      type: 'email',
      position: 1,
    },
  ],
};

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