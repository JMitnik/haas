import { ColourSettings, Customer, CustomerSettings, PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { GraphQLUpload, UserInputError } from 'apollo-server-express';
import { extendType, inputObjectType, mutationField, objectType, scalarType } from '@nexus/schema';
import cloudinary, { UploadApiResponse } from 'cloudinary';

import { CustomerSettingsType } from '../../settings/CustomerSettings';
import { DialogueFilterInputType, DialogueType, DialogueWhereUniqueInput } from '../../questionnaire/Dialogue';
import { UserConnection } from '../../users/graphql/User';
import DialogueService from '../../questionnaire/DialogueService';
import isValidColor from '../../../utils/isValidColor';
import { CampaignModel } from '../../Campaigns';
import { UserConnectionFilterInput } from '../../users/graphql/UserConnection';
import { AutomationModel } from '../../automations/graphql/AutomationModel';
import { AutomationConnection, AutomationConnectionFilterInput } from '../../automations/graphql/AutomationConnection';
import { DialogueConnection, DialogueConnectionFilterInput } from '../../questionnaire';

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
        const customerSettings = await ctx.services.customerService.getCustomerSettingsByCustomerId(parent.id);
        return customerSettings;
      },
    });

    t.field('dialogueConnection', {
      type: DialogueConnection,
      args: { filter: DialogueConnectionFilterInput },
      nullable: true,
      async resolve(parent, args, ctx) {
        console.log('FILTER: ', args.filter);
        let dialogues = await ctx.services.dialogueService.paginatedDialogues(parent.slug, args.filter);
        return dialogues;
      },
    });

    t.field('automationConnection', {
      type: AutomationConnection,
      args: { filter: AutomationConnectionFilterInput },
      nullable: true,
      async resolve(parent, args, ctx) {
        return ctx.services.automationService.paginatedAutomations(parent.slug, args.filter);
      },
    });

    t.field('usersConnection', {
      type: UserConnection,
      args: { customerSlug: 'String', filter: UserConnectionFilterInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        const users = await ctx.services.userService.paginatedUsers(
          parent.slug,
          args.filter,
        );
        return users as any;
      },
    });

    t.list.field('automations', {
      nullable: true,
      type: AutomationModel,
      async resolve(parent, args, ctx) {
        return ctx.services.automationService.findAutomationsByWorkspace(parent.id);
      },
    });

    t.field('dialogue', {
      type: DialogueType,
      nullable: true,
      args: { where: DialogueWhereUniqueInput },

      async resolve(parent, args, ctx) {
        if (args?.where?.slug) {
          const dialogueSlug: string = args.where.slug;

          const customer = await ctx.services.customerService.getDialogueBySlug(parent.id, dialogueSlug);
          return customer || null as any;
        }

        if (args?.where?.id) {
          const dialogueId: string = args.where.id;

          const customer = await ctx.services.customerService.getDialogueById(parent.id, dialogueId);
          return customer || null as any;
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

        let dialogues = await ctx.services.dialogueService.findDialoguesByCustomerId(parent.id);

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
        const customer = await ctx.prisma.customer.findUnique({
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

    t.list.field('campaigns', {
      type: CampaignModel,
      resolve: async (parent, args, ctx) => {
        const workspaceWithCampaigns = await ctx.services.campaignService.findCampaignsOfWorkspace(parent.id);
        if (!workspaceWithCampaigns) throw new UserInputError('Can\'t find workspace!');

        return workspaceWithCampaigns.campaigns.map(campaign => ({
          ...campaign,
          variants: campaign.variantsEdges.map((variantEdge) => ({
            weight: variantEdge.weight,
            ...variantEdge.campaignVariant,
          })),
        })) || [];
      },
    });

    t.list.field('roles', {
      type: 'RoleType',
      nullable: true,

      async resolve(parent, args, ctx) {
        // TODO: Shit gets fucked with my nexus
        const roles = await ctx.services.roleService.getAllRolesForWorkspaceBySlug(parent.slug);

        return roles;
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
    t.int('logoOpacity', { nullable: true });
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
    t.int('logoOpacity');
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

        const waitedFile = await file;
        const { createReadStream, filename, mimetype, encoding }:
          { createReadStream: any; filename: string; mimetype: string; encoding: string } = waitedFile.file;


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

      resolve(parent, args, ctx) {
        if (!args.input) throw new UserInputError('No input provided');
        const primaryColor = args?.input?.primaryColour;

        if (primaryColor) {
          try {
            isValidColor(primaryColor);
          } catch (err) {
            throw new GraphQLError('Color is invalid due to err');
          }
        }

        return ctx.services.customerService.editWorkspace(args.input);
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

    if (!customerId) {
      return null;
    }

    const deletedCustomer = ctx.services.customerService.deleteWorkspace(customerId);

    return deletedCustomer;
  },
});

export const CustomersQuery = extendType({
  type: 'Query',

  definition(t) {
    t.list.field('customers', {
      type: CustomerType,
      async resolve(parent, args, ctx) {
        const customers = await ctx.services.customerService.findAll();
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
          const customer = ctx.services.customerService.findWorkspaceBySlug(args.slug);
          return customer;
        }

        if (args.id) {
          const customer = ctx.services.customerService.findWorkspaceById(args.id);
          return customer;
        }

        throw new UserInputError('Provide workspace Slug or Id');
      },
    });
  },
});
