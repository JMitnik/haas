import { ColourSettings, Customer, CustomerSettings } from '@prisma/client';
import { graphql, GraphQLError } from 'graphql';
import { ApolloError, UserInputError } from 'apollo-server-express';
import { arg, extendType, inputObjectType, mutationField, nonNull, objectType, scalarType } from 'nexus';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import { GraphQLYogaError } from '@graphql-yoga/node';

import { WorkspaceStatistics } from './WorkspaceStatistics';
import { CustomerSettingsType } from '../../settings/CustomerSettings';
import { DialogueFilterInputType, DialogueType, DialogueWhereUniqueInput } from '../../questionnaire/Dialogue';
import { UserConnection } from '../../users/graphql/User';
import isValidColor from '../../../utils/isValidColor';
import { CampaignModel } from '../../Campaigns';
import { UserConnectionFilterInput } from '../../users/graphql/UserConnection';
import { AutomationModel } from '../../automations/graphql/AutomationModel';
import { AutomationConnection, AutomationConnectionFilterInput } from '../../automations/graphql/AutomationConnection';
import { isValidDateTime } from '../../../utils/isValidDate';
import { DialogueStatisticsSummaryFilterInput, DialogueStatisticsSummaryModel, MostTrendingTopic } from '../../questionnaire';
import { DialogueConnection, DialogueConnectionFilterInput } from '../../questionnaire';
import { HealthScore, HealthScoreInput } from './HealthScore';
import { Organization } from '../../Organization/graphql/OrganizationModel';
import { Issue, IssueFilterInput, IssueConnectionFilterInput, IssueConnection } from '../../Issue/graphql';
import { IssueValidator } from '../../Issue/IssueValidator';
import { SessionConnectionFilterInput } from '../../../models/session/graphql';
import { SessionConnection } from '../../session/graphql/Session.graphql'
import { ActionableConnection, ActionableConnectionFilterInput } from '../../actionable/graphql';
import { assertNonNullish } from '../../../utils/assertNonNullish';
import { WorkspaceValidator } from '../WorkspaceValidator';

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
    t.nonNull.string('slug');
    t.nonNull.string('name');

    t.boolean('isDemo');
    t.field('organization', {
      type: Organization,
      nullable: true,
      resolve() {
        return {};
      },
    });

    t.field('settings', {
      type: CustomerSettingsType,
      nullable: true,

      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        const customerSettings = await ctx.services.customerService.getCustomerSettingsByCustomerId(parent.id);
        return customerSettings;
      },
    });

    t.field('sessionConnection', {
      type: SessionConnection,
      args: { filter: SessionConnectionFilterInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.id) return null;

        assertNonNullish(ctx.session?.user?.id, 'No user Id provided!');
        const sessionConnection = await ctx.services.sessionService.getWorkspaceSessionConnection(
          parent.id,
          ctx.session.user.id,
          args.filter
        );

        return sessionConnection;
      },
    });

    /**
     * Workspace-statistics
     * - Note: These statistics share the same ID as the Workspace / Customer.
     */
    t.field('statistics', {
      type: WorkspaceStatistics,
      nullable: true,
      description: 'Workspace statistics',

      resolve: async (parent) => {
        return { id: parent.id }
      },
    });

    /**
     * ActionableConnection
     */
    t.field('actionableConnection', {
      type: ActionableConnection,
      args: {
        input: ActionableConnectionFilterInput,
      },
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find actionable ID!');
        const canAccessAllActionables = WorkspaceValidator.canAccessAllActionables(parent.id, ctx.session);
        const userId = ctx.session?.user?.id as string;

        return ctx.services.actionableService.findPaginatedWorkspaceActionables(
          parent.id as string,
          userId,
          canAccessAllActionables,
          args.input || undefined
        );
      },
    });

    /**
     * Issues Connection
     *
     */
    t.field('issueConnection', {
      type: IssueConnection,
      args: { filter: IssueConnectionFilterInput },
      resolve: async (parent, args, { services }) => {
        assertNonNullish(parent.id, 'Cannot find actionable ID!');
        if (!args.filter) throw new GraphQLYogaError('No filter provided!');
        return await services.issueService.paginatedIssues(parent.id, args.filter);
      },
    });

    /**
     * Issues (by dialogue)
     *
     */
    t.list.field('issueDialogues', {
      type: Issue,
      args: { filter: IssueFilterInput },

      resolve: async (parent, args, { services, session }) => {
        const filter = IssueValidator.resolveFilter(args.filter);
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        assertNonNullish(session?.user?.id, 'No user ID provided!');

        return await services.issueService.getProblemDialoguesByWorkspace(parent.id, filter, session.user.id) as any;
      },
    });

    /**
     * Issues (by topic)
     */
    t.list.field('issueTopics', {
      type: Issue,
      nullable: true,
      args: { input: IssueFilterInput },

      resolve: async (parent, args, { services, session }) => {
        const filter = IssueValidator.resolveFilter(args.input);
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        assertNonNullish(session?.user?.id, 'No user ID provided!');

        return await services.issueService.getWorkspaceIssues(parent.id, filter, session?.user.id) as any;
      },
    });


    t.field('dialogueConnection', {
      type: DialogueConnection,
      args: { filter: DialogueConnectionFilterInput },
      nullable: true,
      async resolve(parent, args, ctx) {
        if (!ctx.session?.user?.id) throw new ApolloError('No user in session found!');

        let dialogues = await ctx.services.dialogueService.paginatedDialogues(
          parent.slug,
          ctx.session?.user?.id,
          args.filter
        );
        return dialogues;
      },
    });

    t.field('automationConnection', {
      type: AutomationConnection,
      args: { filter: AutomationConnectionFilterInput },
      nullable: true,
      async resolve(parent, args, ctx) {
        return ctx.services.automationService.paginatedAutomations(parent.slug, args.filter) as any;
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
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        return ctx.services.automationService.findAutomationsByWorkspace(parent.id);
      },
    });

    t.field('nestedHealthScore', {
      nullable: true,
      deprecation: 'Deprectaed, see statistics',
      type: HealthScore,
      args: {
        input: HealthScoreInput,
      },
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        if (!args.input) throw new GraphQLYogaError('Not input object!');
        const { startDateTime, endDateTime, threshold } = args.input;
        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (startDateTime) {
          utcStartDateTime = isValidDateTime(startDateTime, 'START_DATE') as Date;
        }

        if (endDateTime) {
          utcEndDateTime = isValidDateTime(endDateTime, 'END_DATE');
        }

        return ctx.services.dialogueStatisticsService.findWorkspaceHealthScore(
          parent.id,
          ctx.session?.user?.id as string,
          utcStartDateTime as Date,
          utcEndDateTime,
          undefined,
          threshold || undefined,
        );
      },
    });

    t.field('nestedMostPopular', {
      type: 'MostPopularPath',
      nullable: true,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        if (!args.input) throw new GraphQLYogaError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new GraphQLYogaError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE') as Date;
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.customerService.findNestedMostPopularPath(
          parent.id,
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
        );
      },
    });

    t.field('nestedMostChanged', {
      type: 'MostChangedPath',
      nullable: true,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      useParentResolve: true,
      useTimeResolve: true,
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        if (!args.input) throw new GraphQLYogaError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new GraphQLYogaError('No impact type provided dialogue statistics summary!');
        if (args?.input?.cutoff && args.input.cutoff < 1) throw new UserInputError('Cutoff cannot be a negative number!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE') as Date;
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.customerService.findNestedMostChangedPath(
          parent.id,
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
          args.input.cutoff || undefined,
        );
      },
    });

    t.field('nestedMostTrendingTopic', {
      type: MostTrendingTopic,
      nullable: true,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      useParentResolve: true,
      useTimeResolve: true,
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        if (!args.input) throw new GraphQLYogaError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new GraphQLYogaError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE');
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.customerService.findNestedMostTrendingTopic(
          parent.id,
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
        )
      },
    });

    t.field('nestedDialogueStatisticsSummary', {
      type: DialogueStatisticsSummaryModel,
      deprecation: 'Deprecated, see statistics',
      list: true,
      args: {
        input: DialogueStatisticsSummaryFilterInput,
      },
      nullable: true,
      useParentResolve: true,
      // useQueryCounter: true,
      useTimeResolve: true,
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        if (!args.input) throw new GraphQLYogaError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new GraphQLYogaError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE');
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        return ctx.services.dialogueStatisticsService.findNestedDialogueStatisticsSummary(
          parent.id,
          args.input.impactType,
          utcStartDateTime as Date,
          utcEndDateTime,
          args.input.refresh || false,
        )
      },
    });

    t.field('dialogue', {
      type: DialogueType,
      nullable: true,
      args: { where: DialogueWhereUniqueInput },

      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
        if (args?.where?.slug) {
          const dialogueSlug: string = args.where.slug;

          const customer = await ctx.services.customerService.getDialogueBySlug(parent.id, dialogueSlug);
          return customer || null as any;
        }

        if (args?.where?.id) {
          const dialogueId: string = args.where.id;

          const customer = await ctx.services.dialogueService.getDialogueById(dialogueId);
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
      useQueryCounter: true,
      useTimeResolve: true,
      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');

        let dialogues = await ctx.services.dialogueService.findDialoguesByCustomerId(
          parent.id,
          args.filter?.searchTerm || undefined,
        );

        return dialogues;
      },
    });

    t.list.field('users', {
      type: 'UserType',
      nullable: true,

      async resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find workspace id!');
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
        assertNonNullish(parent.id, 'Cannot find workspace id!');
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
    t.boolean('isDemo', { default: false });
  },
});

export const UploadScalar = scalarType({
  name: 'Upload',
  asNexusMethod: 'upload',
  description: 'The `Upload` scalar type represents a file upload.',
  // sourceType: 'File',
})

export const WorkspaceMutations = extendType({
  type: 'Mutation',

  definition(t) {
    t.field('singleUpload', {
      type: ImageType,
      args: {
        file: nonNull(arg({ type: 'Upload' })),
      },
      async resolve(parent, args) {
        const { file } = args;

        const { createReadStream, filename, mimetype, encoding }:
          { createReadStream: any; filename: string; mimetype: string; encoding: string } = await file.file;

        const stream = new Promise<UploadApiResponse>((resolve, reject) => {
          const cld_upload_stream = cloudinary.v2.uploader.upload_stream({
            folder: 'company_logos',
          }, (error, result: UploadApiResponse | undefined) => {
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

export const MassSeedInput = inputObjectType({
  name: 'MassSeedInput',
  definition(t) {
    t.string('customerId', { required: true }); // 'Group U18 - A1'
    t.int('maxGroups', { required: true });
    t.int('maxTeams', { required: true });
    t.int('maxSessions', { required: true });
  },
})

export const MassSeedMutation = mutationField('massSeed', {
  type: CustomerType,
  nullable: true,
  args: { input: MassSeedInput },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input object!');
    return ctx.services.customerService.massSeed(args.input);
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
