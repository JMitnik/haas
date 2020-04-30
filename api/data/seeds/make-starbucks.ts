import { prisma } from '../../src/generated/prisma-client/index';

import CustomerResolver from '../../src/models/customer/customer-resolver';

const CUSTOMER = 'Starbucks';

const makeStarbucks = async () => {
  const customer = await prisma.createCustomer({
    name: CUSTOMER,
    slug: 'starbucks',
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
  });

  await CustomerResolver.seed(customer);
};

export default makeStarbucks;
