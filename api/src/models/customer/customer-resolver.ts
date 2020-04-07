import { prisma, ID_Input } from '../../generated/prisma-client/index';
import { Customer } from "../../generated/resolver-types";
import { leafNodes, sliderType } from '../../../data/seeds/seedDataStructure';
import { createTemplateLeafNodes, createNodesAndEdges } from '../../../data/seeds/make-company';
import NodeResolver from '../question/node-resolver';

class CustomerResolver {
  static deleteFullCustomerNode = async (obj: any, args: any) => {
    const { id }: { id: ID_Input } = args;
    console.log('Using Customer Resolver delete!');
    const customer = await prisma.deleteCustomer({ id });

    return customer;
  };

  static seed = async (customer: Customer) => {
    const leafs = await createTemplateLeafNodes(leafNodes);

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

    await NodeResolver.createNodesAndEdges(questionnaire.id, customer.name, leafs);
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
