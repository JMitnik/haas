import { PrismaClient } from '@prisma/client';
import CustomerResolver from '../../models/customer/customer-resolver';

const prisma = new PrismaClient();

const CUSTOMER = 'Starbucks';

const makeStarbucks = async () => {
  const customer = await prisma.customer.create({
    data: {
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
    },
  });

  await CustomerResolver.seed(customer);
};

export default makeStarbucks;
