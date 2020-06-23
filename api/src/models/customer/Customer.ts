import { Customer, PrismaClient } from '@prisma/client';
import { GraphQLUpload } from 'apollo-server-express';
import { extendType, inputObjectType, objectType, scalarType } from '@nexus/schema';
import cloudinary, { UploadApiResponse } from 'cloudinary';

import { CustomerSettingsType } from '../settings/CustomerSettings';
// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';
import CustomerService from './CustomerService';
import DialogueService from '../questionnaire/DialogueService';

export const CustomerType = objectType({
  name: 'Customer',
  definition(t) {
    t.id('id');
    t.string('slug');
    t.string('name');

    t.field('settings', {
      type: CustomerSettingsType,
      resolve(parent: Customer, args: any, ctx: any) {
        const customerSettings = ctx.prisma.customerSettings.findOne(
          { where: { customerId: parent.id } },
        );

        return customerSettings;
      },
    });

    t.list.field('dialogues', {
      type: DialogueType,
      resolve(parent: Customer, args: any, ctx: any) {
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

export const ImageType = objectType({
  name: 'ImageType',
  definition(t) {
    t.string('filename', { nullable: true });
    t.string('mimetype', { nullable: true });
    t.string('encoding', { nullable: true });
    t.string('url', { nullable: true });
  },
});

export const Upload = GraphQLUpload && scalarType({
  name: GraphQLUpload.name,
  asNexusMethod: 'upload', // We set this to be used as a method later as `t.upload()` if needed
  description: GraphQLUpload.description,
  serialize: GraphQLUpload.serialize,
  parseValue: GraphQLUpload.parseValue,
  parseLiteral: GraphQLUpload.parseLiteral,
});

const CustomerCreateOptionsInput = inputObjectType({
  name: 'CustomerCreateOptions',
  definition(t) {
    t.string('slug', { required: true });
    t.string('logo');
    t.string('primaryColour');
    t.boolean('isSeed', { default: false, required: false });
    t.string('name', { required: false });
  },
});

interface test {
  url?: string;
}

export const CustomerMutations = Upload && extendType({
  type: 'Mutation',
  definition(t) {
    t.field('singleUpload', {
      type: ImageType,
      args: {
        file: Upload,
      },
      async resolve(parent: any, { file }) {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const stream = new Promise((resolve, reject) => {
          const cld_upload_stream = cloudinary.v2.uploader.upload_stream({
            folder: 'company_logos',
          },
          (error: any, result: UploadApiResponse | undefined) => {
            if (result) {
              return resolve(result);
            }
            return reject(error);
          });

          return createReadStream().pipe(cld_upload_stream);
        });

        const result: any = await stream;
        const { url }: { url: string } = result;
        return { filename, mimetype, encoding, url };
      },
    });
    t.field('createCustomer', {
      type: CustomerType,
      args: {
        name: 'String',
        options: CustomerCreateOptionsInput,
      },
      async resolve(parent: any, args: any) {
        return CustomerService.createCustomer(args);
      },
    });
    t.field('editCustomer', {
      type: CustomerType,
      args: {
        id: 'String',
        options: CustomerCreateOptionsInput,
      },
      resolve(parent: any, args: any) {
        return CustomerService.editCustomer(args);
      },
    });
    t.field('deleteCustomer', {
      type: CustomerType,
      args: {
        where: CustomerWhereUniqueInput,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const customerId = args.where.id;
        // TODO: Check with jonathan if this is preferred for auto completion
        const { prisma }: { prisma: PrismaClient } = ctx;

        const customer = await ctx.prisma.customer.findOne({
          where: { id: customerId },
          include: {
            settings: {
              include: {
                colourSettings: true,
                fontSettings: true,
              },
            },
          },
        });

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
          await Promise.all(dialogueIds.map(async (dialogueId: any) => {
            await DialogueService.deleteDialogue(dialogueId.id);
          }));
        }
        await prisma.tag.deleteMany({ where: { customerId } });

        await prisma.triggerCondition.deleteMany({ where: { trigger: { customerId } } });
        await prisma.trigger.deleteMany({ where: { customerId } });
        await prisma.permission.deleteMany({ where: { customerId } });

        await prisma.user.deleteMany({ where: { customerId } });

        await prisma.role.deleteMany({ where: { customerId } });

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

export default [
  Upload,
  CustomersQuery,
  CustomerQuery,
  CustomerMutations,
  CustomerCreateOptionsInput,
  CustomerType,
];
