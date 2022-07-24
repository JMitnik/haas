import { plugin } from 'nexus';

export const ParentResolvePlugin = plugin({
  name: 'ParentResolvePlugin',
  description: 'Checks if the current field already has been resolved in parent: if enabled, will skip resolving the field',
  fieldDefTypes: 'useParentResolve?: boolean',
  onCreateFieldResolver(test) {
    return async (root, args, ctx, info, next) => {
      const useParentResolve = test.fieldConfig.extensions?.nexus?.config?.useParentResolve;
      const fieldName = info.fieldName;

      // If the field has enabled the plugin, and its parent has it already, return the parent's value.
      if (useParentResolve && root && fieldName && root[fieldName]) return root[fieldName];

      return await next(root, args, ctx, info);
    }
  },
});
