import { PrismaClient } from '@prisma/client';
import CustomerResolver from '../../models/customer/customer-resolver';

const prisma = new PrismaClient();

const CUSTOMER = 'Mediamarkt';

const makeMediamarkt = async () => {
  const customer = await prisma.customer.create({
    data: {
      name: CUSTOMER,
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
    },
  });

  await CustomerResolver.seed(customer);
};

export default makeMediamarkt;
