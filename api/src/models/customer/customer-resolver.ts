import { PrismaClient, Customer } from '@prisma/client';
import { formatDistance, subDays } from 'date-fns';
import { leafNodes } from '../../data/seeds/default-data';
import NodeResolver from '../question/node-resolver';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const prisma = new PrismaClient();
class CustomerResolver {
  static customers = async () => {
    const customers = prisma.customer.findMany();
    return customers;
  };

  static customerSettings = async (parent: Customer) => {
    const customerSettings = prisma.customerSettings.findOne({ where: { customerId: parent.id } });
    return customerSettings;
  };

  static customerBySlug = async (obj: any, args: any) => {
    const { slug } = args;
    const customer = await prisma.customer.findOne({ where: { slug } });

    if (!customer) {
      throw new Error("Can't find slug, shit!");
    }

    console.log(customer);

    return customer;
  };

  static seed = async (customer: Customer) => {
    const questionnaire = await prisma.dialogue.create({
      data: {
        customer: {
          connect: {
            id: customer.id,
          },
        },
        title: 'Default questionnaire',
        description: 'Default questions',
        questions: {
          create: [],
        },
      },
    });

    const leafs = await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

    await NodeResolver.createTemplateNodes(questionnaire.id, customer.name, leafs);

    const currentDate = new Date();
    const amtOfDaysBack = Array.from(Array(30)).map((empty, index) => index + 1);
    const datesBackInTime = amtOfDaysBack.map((amtDaysBack) => subDays(currentDate, amtDaysBack));

    await Promise.all(datesBackInTime.map(async (backDate) => {
      await prisma.session.create({
        data: {
          nodeEntries: {
            create: {
              creationDate: backDate,
              values: {
                create: {
                  numberValue: getRandomInt(100),
                },
              },

            },
          },
          dialogue: {
            connect: {
              id: questionnaire.id,
            },
          },
        },
      });
    }));
  };

  static createCustomer = async (args: any) => {
    const { name, options, slug } = args;
    const { isSeed, logo, primaryColour } = options;

    const customer = await prisma.customer.create({
      data: {
        name,
        slug,
        settings: {
          create: {
            logoUrl: logo,
            colourSettings: {
              create: {
                primary: primaryColour || '#4287f5',
              },
            },
          },
        },
        dialogues: {
          create: [],
        },
      },
    });

    if (isSeed) {
      await CustomerResolver.seed(customer);
    }

    return customer;
  };
}

export default CustomerResolver;
