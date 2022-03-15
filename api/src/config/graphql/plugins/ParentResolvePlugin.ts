import { plugin } from '@nexus/schema';

export const ParentResolvePlugin = plugin({
  name: 'ParentResolvePlugin',
  description: 'Checks if the current field already has been resolved in parent: if enabled, will skip resolving the field',
  fieldDefTypes: `useParentResolve?: boolean`,
  onCreateFieldResolver(test) {
    return async (root, args, ctx, info, next) => {
      try {
        const useParentResolve = test.fieldConfig.extensions?.nexus?.config?.useParentResolve;

        if (useParentResolve) {
          const fieldName = info.fieldName;
          if (root && fieldName && root[fieldName]) {
            return root[fieldName];
          }
        } else {
          const value = await next(root, args, ctx, info)
          return value;
        }
      } catch (error) {
        const value = await next(root, args, ctx, info)
        return value
      }
    }
  }
});
