import { Server } from 'http';
import getPort, { makeRange } from 'get-port';
import { PrismaClient } from '@prisma/client';
import { GraphQLClient } from 'graphql-request';

import { makeServer } from '../../config/server';

type TestContext = {
  client: GraphQLClient;
  server: Server;
};

export const makeTestContext = (prisma: PrismaClient): TestContext => {
  let ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext(prisma);

  beforeEach(async () => {
    const { client, server } = await graphqlCtx.before();

    Object.assign(ctx, {
      client,
      server,
    });
  });

  afterEach(async () => {
    await graphqlCtx.after();
  });

  return ctx;
}

function graphqlTestContext(prisma: PrismaClient) {
  let serverInstance: Server | null = null;

  return {
    async before() {
      const port = await getPort({ port: makeRange(4002, 6000) });
      serverInstance = await makeServer(port, prisma);

      return { client: new GraphQLClient(`http://localhost:${port}/graphql`), server: serverInstance };
    },

    async after() {
      serverInstance?.close();
    },
  };
}
