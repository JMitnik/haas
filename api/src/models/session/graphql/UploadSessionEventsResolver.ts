import { inputObjectType, mutationField, objectType } from '@nexus/schema';

export const UploadSessionEventsInput = inputObjectType({
  name: 'UploadSessionEventsInput',
  definition(t) {
    t.string('sessionId');
  }
});

export const UploadSessionEventsOutput = objectType({
  name: 'UploadSessionEventsOutput',
  definition(t) {
    t.string('status');
  }
});

export const UploadSessionEventsResolver = mutationField('uploadSessionEvents', {
  description: 'Upload a number of events of a session.',
  type: UploadSessionEventsOutput,
  args: { input: UploadSessionEventsInput, },

  resolve: async (parent, args, ctx) => {
    // Validate input: ensure they are fine

    // Call session method to upload events
    return {
      status: 'success',
    };
  }
})
