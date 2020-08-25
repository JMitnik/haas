import { CustomerCreateArgs } from '@prisma/client';
import cuid from 'cuid';

import CustomerService from '../../models/customer/CustomerService';
import prisma from '../../config/prisma';

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
          name: 'SuperAdmin (0)',
          roleId: cuid(),
        },
        {
          name: 'System Admin (1)',
          roleId: cuid(),
        },
        {
          name: 'Admin (2)',
          roleId: cuid(),
        },
        {
          name: 'Normal (3)',
          roleId: cuid(),
        },
        {
          name: 'Business Manager (4)',
          roleId: cuid(),
        },
        {
          name: 'Agent Manager (5)',
          roleId: cuid(),
        },
      ],
    },
  },
};

export const initSampleFullCustomer = async () => {
  const customer = await prisma.customer.create({
    ...sampleFullCustomer,
  });

  // Seed customer
  await CustomerService.seed(customer);

  const seededCustomer = await prisma.customer.findOne({
    where: { id: customer.id },
    include: {
      dialogues: {
        include: {
          questions: true,
        },
      },
      roles: true,
      triggers: true,
    },
  });

  if (!seededCustomer) throw new Error('Error creating/finding customer in sample');

  return seededCustomer;
};
