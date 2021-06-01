/* eslint-disable import/no-cycle */
import { ColourSettings, Customer, CustomerSettings, PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { GraphQLUpload, UserInputError } from 'apollo-server-express';
import { extendType, inputObjectType, mutationField, objectType, scalarType } from '@nexus/schema';
import cloudinary, { UploadApiResponse } from 'cloudinary';

import { CustomerSettingsType } from '../settings/CustomerSettings';
// eslint-disable-next-line import/no-cycle
import { DialogueFilterInputType, DialogueType, DialogueWhereUniqueInput } from '../questionnaire/Dialogue';
// eslint-disable-next-line import/no-cycle
import CustomerService from './CustomerService';
// eslint-disable-next-line import/no-cycle
import { PaginationWhereInput } from '../general/Pagination';
import { UserConnection, UserCustomerType } from '../users/User';
import DialogueService from '../questionnaire/DialogueService';
import UserService from '../users/UserService';
import isValidColor from '../../utils/isValidColor';

export interface CustomerSettingsWithColour extends CustomerSettings {
  colourSettings?: ColourSettings | null;
}

export interface CustomerWithCustomerSettings extends Customer {
  settings?: CustomerSettingsWithColour | null;
}

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

        return customerSettings as any;
      },
    });

    t.field('usersConnection', {
      type: UserConnection,
      args: { customerSlug: 'String', filter: PaginationWhereInput },
      nullable: true,

      async resolve(parent, args) {
        const users = await UserService.paginatedUsers(
          parent.slug,
          {
            pageIndex: args.filter?.pageIndex,
            offset: args.filter?.offset,
            limit: args.filter?.limit,
            orderBy: args.filter?.orderBy,
            searchTerm: args.filter?.searchTerm,
          },

        );

        return users as any;
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
          return customer || null as any;
        }

        if (args?.where?.id) {
          const dialogueId: string = args.where.id;

          const customer = await CustomerService.getDialogueFromCustomerById(parent.id, dialogueId);
          return customer || null as any;
        }

        return null;
      },
    });

    t.field('userCustomer', {
      type: UserCustomerType,
      args: { userId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user id provided');

        const customerWithUsers = await ctx.prisma.customer.findOne({
          where: { id: parent.id },
          include: {
            users: {
              where: {
                userId: args.userId,
              },
              include: {
                user: true,
                role: true,
                customer: true,
              },
            },
          },
        });

        const user = customerWithUsers?.users[0];

        if (!user) throw new UserInputError('Cant find user with this ID');

        return user as any;
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

        return dialogues as any;
      },
    });

    t.list.field('users', {
      type: 'UserType',
      nullable: true,

      async resolve(parent, args, ctx) {
        const customer = await ctx.prisma.customer.findOne({
          where: { id: parent.id },
          include: {
            users: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        });

        const users = customer?.users.map((userCustomer) => userCustomer.user) || null as any;

        return users;
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

const EditWorkspaceInput = inputObjectType({
  name: 'EditWorkspaceInput',
  description: 'Edit a workspace',

  definition(t) {
    t.id('id', { required: true });
    // This one is necessary for auth
    t.string('customerSlug', { required: true });
    t.string('slug', { required: true });
    t.string('name', { required: true });
    t.string('logo');
    t.string('primaryColour', { required: true });
  },
});

const CreateWorkspaceInput = inputObjectType({
  name: 'CreateWorkspaceInput',
  description: 'Creates a workspace',

  definition(t) {
    // Basic workspace information
    t.string('slug', { required: true });
    t.string('name', { required: true });
    t.string('logo');
    t.string('primaryColour', { required: true });

    // Creation specific data
    t.boolean('isSeed', { default: false, required: false });
    t.boolean('willGenerateFakeData', { default: false });
  },
});

export const WorkspaceMutations = Upload && extendType({
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
            if (result) return resolve(result);

            return reject(error);
          });

          return createReadStream().pipe(cld_upload_stream);
        });

        const result = await stream;
        const { secure_url } = result;
        return { filename, mimetype, encoding, url: secure_url };
      },
    });

    t.field('createWorkspace', {
      type: CustomerType,
      args: { input: CreateWorkspaceInput },

      async resolve(parent, args, ctx) {
        if (!args.input) throw new UserInputError('No input provided');
        const primaryColor = args?.input?.primaryColour;

        if (primaryColor) {
          try {
            isValidColor(primaryColor);
          } catch (err) {
            throw new GraphQLError('Color is invalid due to err');
          }
        }

        const workspace = ctx.services.customerService.createWorkspace(args?.input, ctx.session?.user?.id);

        return workspace as any;
      },
    });

    t.field('editWorkspace', {
      type: CustomerType,
      args: { input: EditWorkspaceInput },

      resolve(parent, args) {
        if (!args.input) throw new UserInputError('No input provided');
        const primaryColor = args?.input?.primaryColour;

        if (primaryColor) {
          try {
            isValidColor(primaryColor);
          } catch (err) {
            throw new GraphQLError('Color is invalid due to err');
          }
        }

        return CustomerService.editWorkspace(args.input);
      },
    });
  },
});

export const DeleteCustomerMutation = mutationField('deleteCustomer', {
  type: CustomerType,
  nullable: true,
  args: { where: CustomerWhereUniqueInput },

  async resolve(parent, args) {
    const customerId = args?.where?.id;

    if (!customerId) {
      return null;
    }

    const deletedCustomer = CustomerService.deleteCustomer(customerId);

    return deletedCustomer;
  },
});

export const CustomersQuery = extendType({
  type: 'Query',

  definition(t) {
    t.list.field('customers', {
      type: CustomerType,
      async resolve(parent, args, ctx) {
        const customers = await ctx.prisma.customer.findMany();
        return customers;
      },
    });
  },
});

export const CustomerQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('customer', {
      type: CustomerType,
      args: {
        id: 'ID',
        slug: 'String',
      },
      nullable: true,
      async resolve(parent, args, ctx) {
        if (args.slug) {
          const customer = await ctx.prisma.customer.findOne({ where: { slug: args.slug } });
          return customer;
        }

        if (args.id) {
          const customer = await ctx.prisma.customer.findOne({ where: { id: args.id } });
          return customer;
        }

        throw new UserInputError('Cant find the customer here');
      },
    });
  },
});
