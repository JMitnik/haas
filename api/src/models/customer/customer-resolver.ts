import { PrismaClient } from '@prisma/client';
// import { prisma, ID_Input } from '../../generated/prisma-client/index';
import { Customer } from '../../generated/resolver-types';
import { leafNodes } from '../../data/seeds/default-data';
import NodeResolver from '../question/node-resolver';

const prisma = new PrismaClient();
class CustomerResolver {
  // static deleteFullCustomerNode = async (obj: any, args: any) => {
  //   const { id }: { id: string } = args;
  //   const customerId = id;
  //   const customer = await prisma.deleteCustomer({ id: customerId });
  //   return customer;
  // };

  static customers = async () => {
    const customers = prisma.customer.findMany();
    return customers;
  };

  static customerSettings = async (parent: Customer) => {
    const customerSettings = prisma.customerSettings.findOne({ where: { customerId: parent.id } });
    return customerSettings;
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

    console.log('Dialogue: ', questionnaire);
    const leafs = await NodeResolver.createTemplateLeafNodes(leafNodes, questionnaire.id);

    await NodeResolver.createTemplateNodes(questionnaire.id, customer.name, leafs);
  };

  // static createNewCustomerMutation = async (parent : any, args: any) => {
  //   const { name, options } = args;
  //   const { isSeed, logo, primaryColour } = options;
  //   // TODO: Need to re-implement primary colour field

  //   const customer = await prisma.createCustomer({
  //     name,
  //     settings: {
  //       create: {
  //         logoUrl: logo,
  //         colourSettings: {
  //           create: {
  //             primary: primaryColour || '#4287f5',
  //           },
  //         },
  //       },
  //     },
  //     questionnaires: {
  //       create: [],
  //     },
  //   });

  //   if (isSeed) {
  //     await CustomerResolver.seed(customer);
  //   }

  //   return customer;
  // };
}

export default CustomerResolver;
