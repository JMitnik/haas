import { inputObjectType, mutationField, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server';

import { SessionEventInput } from './SessionEventInput';

export const UploadSessionEventsInput = inputObjectType({
  name: 'UploadSessionEventsInput',
  definition(t) {
    t.string('sessionId');

    t.list.field('events', { type: SessionEventInput });
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
    if (!args.input) throw new UserInputError('No input provided.');

    await ctx.services.sessionService.uploadSessionEvents(args.input);

    return {
      status: 'success',
    };
  }
})
