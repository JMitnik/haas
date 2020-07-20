import { PrismaClient } from '@prisma/client';
import cuid from 'cuid';

import CustomerService from '../../models/customer/CustomerService';

const prisma = new PrismaClient();

const CUSTOMER = 'Starbucks';

const makeStarbucks = async () => {
  const customer = await prisma.customer.create({
    data: {
      name: CUSTOMER,
      slug: 'starbucks',
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
          logoUrl: 'https://www.stickpng.com/assets/images/58428cc1a6515b1e0ad75ab1.png',
          colourSettings: {
            create: {
              primary: '#007143',
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
  });

  await CustomerService.seed(customer);
};

export default makeStarbucks;
