// tests/__helpers.ts                                            // 1

import { Server } from 'http';
import getPort, { makeRange } from 'get-port';
import { PrismaClient } from '@prisma/client';
import { GraphQLClient } from 'graphql-request';

import { makeServer } from '../../config/server';

type TestContext = {
  client: GraphQLClient;
};

export const makeTestContext = (prisma: PrismaClient): TestContext => {
  let ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext(prisma);

  beforeEach(async () => {                                        // 2
    const client = await graphqlCtx.before();

    Object.assign(ctx, {
      client,
    });
  });

  afterEach(async () => {                                         // 3
    await graphqlCtx.after();
  });

  return ctx;                                                     // 8
}

function graphqlTestContext(prisma: PrismaClient) {
  let serverInstance: Server | null = null;

  return {
    async before() {
      const port = await getPort({ port: makeRange(4002, 6000) });  // 4
      serverInstance = await makeServer(port, prisma);

      return new GraphQLClient(`http://localhost:${port}/graphql`);         // 6
    },

    async after() {
      serverInstance?.close();                           // 7
    },
  };
}
