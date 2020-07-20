import { CustomerCreateArgs } from '@prisma/client';
import cuid from 'cuid';

export const sampleCustomerWithoutDialogue: CustomerCreateArgs = {
  data: {
    name: 'HAAS Org',
    slug: 'haas-org',
  },
};

export const sampleFullCustomer: CustomerCreateArgs = {
  data: {
    name: 'HAAS Org',
    slug: 'haas-org',
    tags: {
      create: [
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
    },
    settings: {
      create: {
        logoUrl: 'https://pbs.twimg.com/profile_images/644430670513631232/x7TWAZrV_400x400.png',
        colourSettings: {
          create: {
            primary: '#e31e24',
          },
        },
      },
    },
    roles: {
      create: [
        {
          name: 'Admin',
          roleId: cuid(),
        },
        {
          name: 'Normal',
          roleId: cuid(),
        },
        {
          name: 'Custom role',
          roleId: cuid(),
        },
      ],
    },
  },
};
