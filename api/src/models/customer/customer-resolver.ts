import { PrismaClient, Customer } from '@prisma/client';
import { subDays } from 'date-fns';
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
    const options = ['Facilities', 'Website/Mobile app', 'Product/Services', 'Customer support'];

    await Promise.all(datesBackInTime.map(async (backDate) => {
      const randomOptionElement = options[Math.floor(Math.random() * options.length)];
      await prisma.session.create({
        data: {
          nodeEntries: {
            create: [
              {
                depth: 0,
                creationDate: backDate,
                values: {
                  create: {
                    numberValue: getRandomInt(100),
                  },
                },
              },
              {
                depth: 1,
                creationDate: backDate,
                values: {
                  create: {
                    textValue: randomOptionElement,
                  },
                },
              },
            ],
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

  static editCustomer = async (args: any) => {
    const { id, options } = args;
    const { logo, primaryColour, slug, name } = options;
    const customerSettings = await prisma.customerSettings.update({
      where: {
        customerId: id,
      },
      data: {
        logoUrl: logo,
      },
    });

    await prisma.colourSettings.update({
      where: {
        id: customerSettings.colourSettingsId,
      },
      data: {
        primary: primaryColour,
      },
    });

    const customer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        slug,
        name,
      },
    });

    return customer;
  };

  static createCustomer = async (args: any) => {
    const { name, options } = args;
    const { isSeed, logo, primaryColour, slug, cloudinary } = options;
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
