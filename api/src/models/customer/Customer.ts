import { Customer, PrismaClient } from '@prisma/client';
import { objectType, extendType, inputObjectType } from '@nexus/schema';

import { CustomerSettingsType } from '../settings/CustomerSettings';
import { DialogueType } from '../questionnaire/Dialogue';

import DialogueResolver from '../questionnaire/dialogue-resolver';
import CustomerResolver from './customer-resolver';

export const CustomerType = objectType({
  name: 'Customer',
  definition(t) {
    t.id('id');
    t.string('slug');
    t.string('name');
    t.field('settings', {
      type: CustomerSettingsType,
      resolve(parent: Customer, args: any, ctx: any, info: any) {
        const customerSettings = ctx.prisma.customerSettings.findOne(
          { where: { customerId: parent.id } },
        );
        return customerSettings;
      },
    });
    t.list.field('dialogues', {
      type: DialogueType,
      resolve(parent: Customer, args: any, ctx: any, info: any) {
        const dialogues = ctx.prisma.dialogue.findMany({
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

export const CustomerCreateOptionsInput = inputObjectType({
  name: 'CustomerCreateOptions',
  definition(t) {
    t.boolean('isSeed', { default: false, required: false });
    t.string('slug', { required: true });
    t.string('logo');
    t.string('primaryColour');
    t.string('name', { required: false });
  },
});

export const CustomerMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createCustomer', {
      type: CustomerType,
      args: {
        name: 'String',
        options: CustomerCreateOptionsInput,
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return CustomerResolver.createCustomer(args);
      },
    });
    t.field('editCustomer', {
      type: CustomerType,
      args: {
        id: 'String',
        options: CustomerCreateOptionsInput,
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return CustomerResolver.editCustomer(args);
      },
    });
    t.field('deleteCustomer', {
      type: CustomerType,
      args: {
        where: CustomerWhereUniqueInput,
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const customerId = args.where.id;
        // TODO: Check with jonathan if this is preferred for auto completion
        const { prisma } : { prisma: PrismaClient } = ctx.prisma;

        const customer = await ctx.prisma.customer.findOne({ where: { id: customerId },
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

        // //// Settings-related
        if (fontSettingsId) {
          await ctx.prisma.fontSettings.delete({
            where: {
              id: fontSettingsId,
            },
          });
        }

        if (colourSettingsId) {
          await ctx.prisma.colourSettings.delete({
            where: {
              id: colourSettingsId,
            },
          });
        }

        if (customer?.settings) {
          await ctx.prisma.customerSettings.delete({
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

        await ctx.prisma.customer.delete({
          where: {
            id: customerId,
          },
        });
        return customer;
      },
    });
  },
});

export const CustomersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('customers', {
      type: CustomerType,
      async resolve(parent: any, args: any, ctx: any) {
        const customers = await ctx.prisma.customer.findMany();
        return customers;
      },
    });
  },
});

interface ContextProps {
  prisma: PrismaClient;
}

export const CustomerQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('customer', {
      type: CustomerType,
      args: {
        id: 'ID',
        slug: 'String',
      },
      async resolve(parent: any, args: any, ctx: any): Promise<Customer | null> {
        const { prisma } : { prisma: PrismaClient } = ctx;

        if (args.slug) {
          const customer = await prisma.customer.findOne({ where: { slug: args.slug } });
          return customer;
        }

        if (args.id) {
          const customer = await prisma.customer.findOne({ where: { id: args.id } });
          return customer;
        }

        throw new Error('Cant find the customer here');
      },
    });
  },
});

const customerNexus = [
  CustomersQuery,
  CustomerQuery,
  CustomerMutations,
  CustomerCreateOptionsInput,
  CustomerType];

export default customerNexus;
