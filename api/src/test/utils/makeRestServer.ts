import { Server } from 'http';
import getPort, { portNumbers } from 'get-port';
import { PrismaClient } from '@prisma/client';

import { makeServer } from '../../config/server';

interface RestContextProps {
  serverInstance: Server | null;
  port: number | null;
}


export const makeRestServer = (prisma: PrismaClient) => {
  let serverInstance: Server | null = null;
  let restContext = {} as RestContextProps;

  beforeEach(async () => {
    const port = await getPort({ port: portNumbers(4002, 6000) });
    serverInstance = await makeServer(port, prisma);

    Object.assign(restContext, {
      serverInstance: serverInstance,
      port,
    })
  });

  afterEach(async () => {
    serverInstance?.close();
  });

  return restContext;
}
