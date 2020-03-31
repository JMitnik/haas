import { prisma } from '../../src/generated/prisma-client/index';

import { createNewCompany } from './make-company';

const CUSTOMER = 'Starbucks';

const makeStarbucks = async () => {
  const customer = await prisma.createCustomer({
    name: CUSTOMER,
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

  await createNewCompany(customer);
};

export default makeStarbucks;
