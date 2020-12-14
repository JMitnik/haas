import { enumType, inputObjectType, mutationField, objectType } from '@nexus/schema';

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
    t.string('name');
    t.string('website');
    t.string('logo');
    t.string('primaryColour');
    t.string('firstName');
    t.string('answer1');
    t.string('answer2');
    t.string('answer3');
    t.string('answer4');
  },
});

export const GenerateAutodeckMutation = mutationField('generateAutodeck', {
  type: JobObjectType,
  nullable: true,
  args: { input: GenerateAutodeckInput },

  resolve(parent, args) {
    console.log('input: ', args.input);
    const customerId = args?.input?.name;

    if (!customerId) {
      return null;
    }

    return null;
  },
});
