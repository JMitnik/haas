import { inputObjectType, mutationField, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server';

import { SessionEventInput } from './SessionEventInput';

export const CreateSessionEventsInput = inputObjectType({
  name: 'CreateSessionEventsInput',
  definition(t) {
    t.string('sessionId');

    t.list.field('events', { type: SessionEventInput });
  }
});

export const CreateSessionEventsOutput = objectType({
  name: 'CreateSessionEventsOutput',
  definition(t) {
    t.string('status');
  }
});

export const CreateSessionEventsResolver = mutationField('createSessionEvents', {
  description: 'Create a number of events of a session.',
  type: CreateSessionEventsOutput,
  args: { input: CreateSessionEventsInput, },

  resolve: async (parent, args, ctx) => {
    // Validate input: ensure they are fine
    if (!args.input) throw new UserInputError('No input provided.');
    if (!args.input.sessionId) throw new UserInputError('Missing sessionId');
    if (!args.input.events) throw new UserInputError('Missing events');

    await ctx.services.sessionService.addEventsToSession(args.input.sessionId, args.input.events);

    return {
      status: 'success',
    };
  }
})
