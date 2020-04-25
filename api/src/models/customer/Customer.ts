import { PrismaClient, Customer } from '@prisma/client';
import { objectType, queryType } from '@nexus/schema';

import CustomerSettingsType from '../settings/CustomerSettings';

const prisma = new PrismaClient();

export const DialogueType = objectType({
  name: 'Dialogue',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('description');
    t.string('publicTitle', { nullable: true });
  },
});

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

export const CustomersQuery = objectType({
  name: 'Query',
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
