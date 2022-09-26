import { Server } from 'http';
import getPort, { makeRange } from 'get-port';
import { PrismaClient } from 'prisma/prisma-client';
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

export function graphqlTestContext(prisma: PrismaClient) {
  let serverInstance: Server | null = null;
  let client: GraphQLClient | null = null;
  let port: number | null = null;
  let rand = 'test' + Math.random();
  let isRun = false;

  return {
    server() {
      if (!client) throw Error('Not initialized yet; run before');

      return { client, port, rand }
    },
    isRun() {
      return isRun
    },
    async before() {
      isRun = true;
      port = await getPort({ port: makeRange(4002, 6000) });
      serverInstance = await makeServer(port, prisma);
      client = new GraphQLClient(`http://localhost:${port}/graphql`);

      return { isRun, client, port: port, rand };
    },

    async after() {
      serverInstance?.close();
    },

    afterAll() {
      serverInstance?.close();
    },

    afterEach() {
      serverInstance?.close();
    },
  };
}
