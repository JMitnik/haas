import { Server } from 'http';
import getPort, { portNumbers } from 'get-port';
import { PrismaClient } from '@prisma/client';
import { GraphQLClient } from 'graphql-request';

import { makeServer } from '../../config/server';

interface TestContext {
  client: GraphQLClient;
  port: number;
}

export const makeTestContext = (prisma: PrismaClient): TestContext => {
  let ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext(prisma);

  beforeEach(async () => {
    const { client, port } = await graphqlCtx.before();

    Object.assign(ctx, {
      client,
      port,
    });
  });

  afterEach(async () => {
    await graphqlCtx.after();
  });

  afterAll(async () => {
    await graphqlCtx.after();
  })

  return ctx;
}

function graphqlTestContext(prisma: PrismaClient) {
  let serverInstance: Server | null = null;

  return {
    async before() {
      const port = await getPort({ port: portNumbers(4002, 6000) });
      serverInstance = await makeServer(port, prisma);

      return { client: new GraphQLClient(`http://localhost:${port}/graphql`), port: port };
    },

    async after() {
      serverInstance?.close();
    },
  };
}
