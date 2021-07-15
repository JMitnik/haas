export default {
  data: {
    me: {
      id: 'ckm79z7fi000001mhf8pw9wkq',
      email: 'daan@haas.live',
      firstName: 'Daan',
      lastName: 'Helsloot',
      phone: '',
      globalPermissions: [
        'CAN_ACCESS_ADMIN_PANEL',
      ],
      userCustomers: [
        {
          customer: {
            id: 'ckm7af2gj0050yfr5ykrvzyvf',
            name: 'Lufthansa',
            slug: 'lufthansa',
            __typename: 'Customer',
          },
          role: {
            name: 'Admin',
            permissions: [
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
            __typename: 'RoleType',
          },
          __typename: 'UserCustomer',
        },
      ],
      __typename: 'UserType',
    },
  },
};
