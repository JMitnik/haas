
import { enumType, inputObjectType, mutationField, objectType } from '@nexus/schema';
import AutodeckService from './AutodeckService';

export const CloudReferenceType = enumType({
  name: 'CloudReferenceType',
  members: ['AWS', 'GCP', 'Azure', 'IBM'],
});

export const JobStatusType = enumType({
  name: 'JobStatusType',
  members: ['PENDING', 'COMPLETED', 'FAILED'],
});

export const CreateWorkspaceJobType = objectType({
  name: 'CreateWorkspaceJobType',
  definition(t) {
    t.string('id');
    t.string('referenceId');
    t.string('status');
    t.string('resourceUrl');
    t.field('cloudReference', {
      type: CloudReferenceType,
    });
    t.field('status', {
      type: JobStatusType,
    });
  },
});

export const JobObjectType = objectType({
  name: 'JobObjectType',
  definition(t) {
    t.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.string('createWorkspaceJobId');
    t.field('createWorkspaceJob', {
      type: CreateWorkspaceJobType,
      nullable: true,
    });
  },
});

export const GenerateAutodeckInput = inputObjectType({
  name: 'GenerateAutodeckInput',
  description: 'Generate sales documents',

  definition(t) {
    t.string('name', { required: true });
    t.string('website', { required: true });
    t.string('logo', { required: true });
    t.string('primaryColour', { required: true });
    t.string('firstName', { required: true });
    t.string('answer1', { required: true });
    t.string('answer2', { required: true });
    t.string('answer3', { required: true });
    t.string('answer4', { required: true });
  },
});

export const GenerateAutodeckMutation = mutationField('generateAutodeck', {
  type: JobObjectType,
  nullable: true,
  args: { input: GenerateAutodeckInput },

  async resolve(parent, args) {
    console.log('input: ', args.input);
    const { input } = args;

    if (!input) {
      return null;
    }

    const job = await AutodeckService.createJob(input);

    return job ? job as any : null;
  },
});

export const UpdateJobMutation = mutationField('updateJob', {
  type: JobObjectType,
  nullable: true,
  args: { id: 'String', status: JobStatusType, resourceUrl: 'String', referenceId: 'String' },
  resolve(parent, args, ctx) {
    const { id, resourceUrl, status } = args;

    if (!args.id) {
      return null;
    }

    return ctx.prisma.job.update({
      where: {
        id: id || undefined,
      },
      data: {
        createWorkspaceJob: {
          update: {
            resourcesUrl: resourceUrl,
            status: status || undefined,
          },
        },
      },
      include: {
        createWorkspaceJob: true,
      },
    }) as any;
  },

});
