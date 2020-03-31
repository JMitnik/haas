import { prisma } from '../../src/generated/prisma-client/index';

import { createQuestionnaire } from './make-company';

const CUSTOMER = 'F45 Training';

const makef45 = async () => {
  const customer = await prisma.createCustomer({
    name: CUSTOMER,
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
  });

  await createQuestionnaire(customer);
};

export default makef45;
