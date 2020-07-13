import { Customer, PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { extendType, inputObjectType, mutationField, objectType, scalarType } from '@nexus/schema';
import cloudinary, { UploadApiResponse } from 'cloudinary';

import { CustomerSettingsType } from '../settings/CustomerSettings';
// eslint-disable-next-line import/no-cycle
import { DialogueFilterInputType, DialogueType, DialogueWhereUniqueInput } from '../questionnaire/Dialogue';
import CustomerService from './CustomerService';
// eslint-disable-next-line import/no-cycle
import DialogueService from '../questionnaire/DialogueService';
import isValidColor from '../../utils/isValidColor';

export const CustomerType = objectType({
  name: 'Customer',
  definition(t) {
    t.id('id');
    t.string('slug');
    t.string('name');

    t.field('settings', {
      type: CustomerSettingsType,
      nullable: true,

      async resolve(parent: Customer, args, ctx) {
        const customerSettings = await ctx.prisma.customerSettings.findOne({
          where: { customerId: parent.id },
        });

        return customerSettings;
      },
    });

    t.field('dialogue', {
      type: DialogueType,
      nullable: true,
      args: { where: DialogueWhereUniqueInput },

      async resolve(parent, args) {
        if (args?.where?.slug) {
          const dialogueSlug: string = args.where.slug;

          const customer = await CustomerService.getDialogueFromCustomerBySlug(parent.id, dialogueSlug);
          return customer || null;
        }

        if (args?.where?.id) {
          const dialogueId: string = args.where.id;

          const customer = await CustomerService.getDialogueFromCustomerById(parent.id, dialogueId);
          return customer || null;
        }

        return null;
      },
    });

    t.list.field('dialogues', {
      type: DialogueType,
      nullable: true,
      args: {
        filter: DialogueFilterInputType,
      },
      async resolve(parent: Customer, args, ctx) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        let dialogues = await prisma.dialogue.findMany({
          where: {
            customerId: parent.id,
          },
          include: {
            tags: true,
          },
        });

        if (args.filter && args.filter.searchTerm) {
          dialogues = DialogueService.filterDialoguesBySearchTerm(dialogues, args.filter.searchTerm);
        }

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
    t.string('primaryColour', { required: true });
    t.string('logo');
    t.boolean('isSeed', { default: false, required: false });
  },
});

const CustomerEditOptionsInput = inputObjectType({
  name: 'CustomerEditOptions',
  definition(t) {
    t.string('slug', { required: true });
    t.string('name', { required: true });
    t.string('logo');
    t.string('primaryColour', { required: true });
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
      async resolve(parent, args) {
        const { file } = args;
        const { createReadStream, filename, mimetype, encoding } = await file;
        const stream = new Promise<UploadApiResponse>((resolve, reject) => {
          const cld_upload_stream = cloudinary.v2.uploader.upload_stream({
            folder: 'company_logos',
          },
          (error, result: UploadApiResponse | undefined) => {
            if (result) {
              return resolve(result);
            }
            return reject(error);
          });

          return createReadStream().pipe(cld_upload_stream);
        });

        const result = await stream;
        const { url } = result;
        return { filename, mimetype, encoding, url };
      },
    });
    t.field('createCustomer', {
      type: CustomerType,
      args: {
        name: 'String',
        options: CustomerCreateOptionsInput,
      },
      async resolve(parent, args) {
        const primaryColor = args?.options?.primaryColour;

        if (primaryColor) {
          try {
            isValidColor(primaryColor);
          } catch (err) {
            throw new GraphQLError('Color is invalid due to err');
          }
        }

        return CustomerService.createCustomer(args);
      },
    });
    t.field('editCustomer', {
      type: CustomerType,
      args: {
        id: 'String',
        options: CustomerEditOptionsInput,
      },
      resolve(parent, args) {
        const primaryColor = args?.options?.primaryColour;

        if (primaryColor) {
          try {
            isValidColor(primaryColor);
          } catch (err) {
            throw new GraphQLError('Color is invalid due to err');
          }
        }

        return CustomerService.editCustomer(args);
      },
    });
  },
});

export const DeleteCustomerMutation = mutationField('deleteCustomer', {
  type: CustomerType,
  nullable: true,
  args: { where: CustomerWhereUniqueInput },

  async resolve(parent, args, ctx) {
    const customerId = args?.where?.id;
    if (!customerId) return null;

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

    if (!customer) return null;

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

    const dialogueIds = await ctx.prisma.dialogue.findMany({
      where: {
        customerId,
      },
      select: {
        id: true,
      },
    });

    if (dialogueIds.length > 0) {
      await Promise.all(dialogueIds.map(async (dialogueId) => {
        await DialogueService.deleteDialogue(dialogueId.id);
      }));
    }

    await ctx.prisma.tag.deleteMany({ where: { customerId } });

    await ctx.prisma.triggerCondition.deleteMany({ where: { trigger: { customerId } } });
    await ctx.prisma.trigger.deleteMany({ where: { customerId } });
    await ctx.prisma.permission.deleteMany({ where: { customerId } });

    await ctx.prisma.user.deleteMany({ where: { customerId } });

    await ctx.prisma.role.deleteMany({ where: { customerId } });

    await ctx.prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

    return customer || null;
  },
});

export const CustomersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('customers', {
      type: CustomerType,
      async resolve(parent, args, ctx) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const customers = await prisma.customer.findMany();
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
      async resolve(parent, args, ctx): Promise<Customer | null> {
        const { prisma }: { prisma: PrismaClient } = ctx;

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
