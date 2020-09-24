import { RoleCreateInput, TagCreateInput, TagEnum } from '@prisma/client';

interface Tag {
  name: string,
  type: TagEnum,
}

interface WorkspaceTemplateProps {
  roles: RoleCreateInput[],
  tags: Tag[],
}

const defaultWorkspaceTemplate: WorkspaceTemplateProps = {
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
      name: 'Marketing strategy #131',
      type: 'DEFAULT',
    },
  ],
  roles: [
    {
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
    },
    {
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
    },
    {
      name: 'User',
      type: 'USER',
      permissions: {
        set: [
          'CAN_VIEW_DIALOGUE',
          'CAN_VIEW_DIALOGUE_ANALYTICS',
        ],
      },
    },
  ],
};

export default defaultWorkspaceTemplate;
