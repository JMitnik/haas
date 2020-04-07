import { prisma, ID_Input } from '../../generated/prisma-client/index';
import { Customer } from '../../generated/resolver-types';
import { leafNodes } from '../../../data/seeds/seedDataStructure';
import NodeResolver from '../question/node-resolver';

class CustomerResolver {
  static deleteFullCustomerNode = async (obj: any, args: any) => {
    const { id }: { id: ID_Input } = args;
    const customer = await prisma.deleteCustomer({ id });

    return customer;
  };

  static seed = async (customer: Customer) => {
    const leafs = await NodeResolver.createTemplateLeafNodes(leafNodes);

    const questionnaire = await prisma.createQuestionnaire({
      customer: {
        connect: {
          id: customer.id,
        },
      },
      leafs: {
        connect: leafs.map((leaf) => ({ id: leaf.id })),
      },
      title: 'Default questionnaire',
      description: 'Default questions',
      questions: {
        create: [],
      },
    });

    await NodeResolver.createTemplateNodes(questionnaire.id, customer.name, leafs);
  };

  static createNewCustomerMutation = async (parent : any, args: any) => {
    const { name, options } = args;
    const { isSeed, logo } = options;

    const customer = await prisma.createCustomer({
      name,
      settings: {
        create: {
          logoUrl: logo,
          colourSettings: {
            create: {
              primary: '#4287f5',
            },
          },
        },
      },
      questionnaires: {
        create: [],
      },
    });

    if (isSeed) {
      await CustomerResolver.seed(customer);
    }

    return customer;
  };
}

export default CustomerResolver;
