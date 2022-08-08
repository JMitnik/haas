import { objectType } from 'nexus';
import { UserInputError } from 'apollo-server-express';

import { OrganizationLayer } from './OrganizationLayer';
import { assertNonNullish } from '../../../utils/assertNonNullish';

export const Organization = objectType({
  name: 'Organization',
  description: `
    An Organization defines the underlying members structure of a workspace, corresponding to an org-chart.
  `,

  definition(t) {
    t.id('id', {
      resolve: (parent, args, ctx, info) => `ORG-${info.variableValues.workspaceId}`,
    });

    t.list.field('layers', {
      type: OrganizationLayer,
      nullable: true,
      async resolve(parent, args, ctx, info) {
        if (!info.variableValues.workspaceId) throw new UserInputError('No workspaceId provided to get organization layers');

        assertNonNullish(ctx.session?.user?.id, 'No user ID provided!');

        return ctx.services.organizationService.getOrganizationLayers(
          info.variableValues.workspaceId,
          ctx.session.user.id
        );
      },
    });
  },
});