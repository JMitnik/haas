import { PrismaClient } from '@prisma/client';
import CustomerResolver from '../../models/customer/customer-resolver';
import cuid from 'cuid';

const prisma = new PrismaClient();

const CUSTOMER = 'Mediamarkt';

const makeMediamarkt = async () => {
  const customer = await prisma.customer.create({
    data: {
      name: CUSTOMER,
      slug: 'mediamarkt',
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
  });

  await CustomerResolver.seed(customer);
};

export default makeMediamarkt;
