import { plugin } from 'nexus';
declare global {
  namespace NodeJS {
    interface Global { }
  }
}

interface CustomNodeJsGlobal extends NodeJS.Global {
  nrQueries: number;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

export const QueryCounterPlugin = plugin({
  name: 'QueryCounterPlugin',
  description: 'Counts number of queries performed in the current field',
  fieldDefTypes: 'useQueryCounter?: boolean',
  onCreateFieldResolver(test) {
    return async (root, args, ctx, info, next) => {
      const isTest = process.env.NODE_ENV === 'test';
      const isProd = process.env.NODE_ENV === 'production';
      const useQueryCounter = test.fieldConfig.extensions?.nexus?.config?.useQueryCounter;

      let nrQueriesStart = global.nrQueries;
      const value = await next(root, args, ctx, info);
      let nrQueriesEnd = global.nrQueries;

      // Reset nrQueries
      global.nrQueries = 0;
      if (!isProd && !isTest && useQueryCounter && global && global.nrQueries !== undefined) {
        if (test.parentTypeConfig.name === 'Mutation') {
          console.log(`Nr Queries ran for operation ${info.operation.name?.value} : ${nrQueriesEnd - nrQueriesStart}`);
        } else {
          console.log(`Nr Queries ran for field ${info.fieldName} : ${nrQueriesEnd - nrQueriesStart}`);
        }
      }

      return value;
    }
  },
});
