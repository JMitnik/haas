import { list, mutationField, nonNull, stringArg } from 'nexus';

export const DispatchUserTour = mutationField('dispatchUserTour', {
  type: 'Boolean',
  args: { id: nonNull(stringArg()), userIds: list(nonNull(stringArg())) },
  async resolve(parent, args, ctx) {
    return ctx.services.userTourService.dispatchUserTour(args.id, args.userIds || undefined);
  },
})