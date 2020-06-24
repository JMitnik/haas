import { PrismaClient } from '@prisma/client';
import cuid from 'cuid';

import CustomerResolver from '../../models/customer/customer-resolver';

const prisma = new PrismaClient();
const CUSTOMER = 'F45 Training';

const makef45 = async () => {
  const customer = await prisma.customer.create({
    data: {
      name: CUSTOMER,
      slug: 'f45',
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
          logoUrl: 'https://f45glastonbury.com/wp-content/uploads/2019/03/F45_TRAINING_LOGO_2016-3-e1551454822921.png',
          colourSettings: {
            create: {
              primary: '#ce2628',
              primaryAlt: '#01032c',
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

export default makef45;
