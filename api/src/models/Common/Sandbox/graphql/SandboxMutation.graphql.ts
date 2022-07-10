import { mutationField, inputObjectType } from '@nexus/schema';
import { ConditionDialogueScopeInput } from 'models/automations';

export const SandboxInput = inputObjectType({
  name: 'SandboxInput',
  definition(t) {
    t.string('name');
    t.boolean('onlyGet');
    t.int('value');
  }
});

export const Sandbox = mutationField('sandbox', {
  type: 'String',
  args: { input: SandboxInput },

  resolve: async (_, { input }, { services }) => {
    if (!input) return 'no';

    if (input.onlyGet) {
      return await services.redisService.get(input.name || '') as string;
    }

    await services.redisService.set(input.name || '', input.value || 1);

    return '';
  },
});
