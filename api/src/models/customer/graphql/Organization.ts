import { objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';
import { OrganizationLayer } from './OrganizationLayer';

export const Organization = objectType({
  name: 'Organization',
  definition(t) {
    t.list.field('layers', {
      type: OrganizationLayer,
      nullable: true,
      async resolve(parent, args, ctx, info) {
        if (!info.variableValues.workspaceId) throw new UserInputError('No workspaceId provided to get organization layers');

        return ctx.services.customerService.getOrganizationLayers(info.variableValues.workspaceId);
      },
    });
  },
});
