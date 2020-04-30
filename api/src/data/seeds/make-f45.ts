import { PrismaClient } from '@prisma/client';
import CustomerResolver from '../../models/customer/customer-resolver';

const prisma = new PrismaClient();

const CUSTOMER = 'F45 Training';

const makef45 = async () => {
  const customer = await prisma.customer.create({
    data: {
      name: CUSTOMER,
      slug: 'f45',
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
    },
  });
  await CustomerResolver.seed(customer);
};

export default makef45;
