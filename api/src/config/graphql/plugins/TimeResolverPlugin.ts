import { plugin } from 'nexus';

import { logger } from '../../logger';

export const TimeResolverPlugin = plugin({
  name: 'TimeResolvePlugin',
  description: 'Measures the time it takes before the field is finished',
  fieldDefTypes: 'useTimeResolve?: boolean',
  onCreateFieldResolver(test) {
    return async (root, args, ctx, info, next) => {
      const isTest = process.env.NODE_ENV === 'test';

      const useTimeResolve = test.fieldConfig.extensions?.nexus?.config?.useTimeResolve;
      const startTimeMs = new Date().valueOf()
      const value = await next(root, args, ctx, info);
      const endTimeMs = new Date().valueOf()

      if (!isTest && useTimeResolve) {
        logger.logMetric(`Operation ${info.operation.name?.value} took ${endTimeMs - startTimeMs} ms`);
      }

      return value;
    }
  },
});
