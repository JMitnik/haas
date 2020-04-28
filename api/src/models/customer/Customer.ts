import { PrismaClient, Customer } from '@prisma/client';
import { objectType, queryType, extendType, inputObjectType, arg } from '@nexus/schema';

import CustomerSettingsType from '../settings/CustomerSettings';
import { DialogueType } from '../questionnaire/Dialogue';

import DialogueResolver from '../questionnaire/questionnaire-resolver';

const prisma = new PrismaClient();

const CustomerType = objectType({
  name: 'Customer',
  definition(t) {
    t.id('id');
    t.string('name');
    t.field('settings', {
      type: CustomerSettingsType,
      resolve(parent: Customer, args: any, ctx: any, info: any) {
        const customerSettings = prisma.customerSettings.findOne({ where: { customerId: parent.id } });
        return customerSettings;
      },
    });
    t.list.field('dialogues', {
      type: DialogueType,
      resolve(parent: Customer, args: any, ctx: any, info: any) {
        const dialogues = prisma.dialogue.findMany({
          where: {
            customerId: parent.id,
          },
        });
        return dialogues;
      },
    });
  },
});

export const CustomerWhereUniqueInput = inputObjectType({
  name: 'CustomerWhereUniqueInput',
  definition(t) {
    t.id('id', { required: true });
  },
});

export const DeleteCustomerMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteCustomer', {
      type: CustomerType,
      args: {
        where: CustomerWhereUniqueInput,
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const customerId = args.where.id;
        console.log('Customer ID: ', customerId);

        const customer = await prisma.customer.findOne({ where: { id: customerId },
          include: {
            settings: {
              include: {
                colourSettings: true,
                fontSettings: true,
              },
            },
          } });

        const colourSettingsId = customer?.settings?.colourSettingsId;
        const fontSettingsId = customer?.settings?.fontSettingsId;
        console.log(customer?.settings);

        // //// Settings-related
        if (fontSettingsId) {
          await prisma.fontSettings.delete({
            where: {
              id: fontSettingsId,
            },
          });
        }

        if (colourSettingsId) {
          await prisma.colourSettings.delete({
            where: {
              id: colourSettingsId,
            },
          });
        }

        if (customer?.settings) {
          await prisma.customerSettings.delete({
            where: {
              customerId,
            },
          });
        }

        const dialogueIds = await prisma.dialogue.findMany({
          where: {
            customerId,
          },
          select: {
            id: true,
          },
        });

        if (dialogueIds.length > 0) {
          await Promise.all(dialogueIds.map(async (dialogueId) => {
            await DialogueResolver.deleteDialogue(dialogueId.id);
          }));
        }

        const deletedCustomer = await prisma.customer.delete({
          where: {
            id: customerId,
          },
        });
        console.log('Deleted customer: ', deletedCustomer.id);
        return customer;
      },
      // deleteCustomer(where: CustomerWhereUniqueInput!): Customer
    });
  },
});

export const CustomersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('customers', {
      type: CustomerType,
      resolve(parent: any, args: any, ctx: any, info: any) {
        const customers = prisma.customer.findMany();
        return customers;
      },
    });
  },
});

export default CustomerType;
