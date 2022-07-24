import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import Fastify from 'fastify';
import ExpressPlugin from 'fastify-express';
import MultiPartPlugin from 'fastify-multipart';
import CookiePlugin from 'fastify-cookie';
import { processRequest } from 'graphql-upload';
import fs from 'fs';
import https from 'https';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

import { logger } from './logger';
import DeliveryWebhookRoute from '../routes/webhooks/DeliveryWebhookRoute';
import { makeApollo } from './apollo';
import config from './config';

export const makeServer = async (port: number, prismaClient: PrismaClient) => {
  logger.logLifeCycle('Starting application');
  const app = Fastify();

  await app.register(ExpressPlugin);
  await app.register(MultiPartPlugin);
  await app.register(CookiePlugin);

  // Format the request body to follow graphql-upload's
  app.addHook('preValidation', async function (request, reply) {
    if (!request.isMultipart()) {
      return;
    }

    request.body = await processRequest(request.raw, reply.raw);
  });

  const corsOptions: CorsOptions = {
    // Hardcoded for the moment
    origin: (origin, callback) => {
      callback(null, true);
      const validOrigins = ['http://localhost:3002', 'https://192.168.68.114:3000/', 'dashboard.haas.live', 'client.haas.live', 'haas-dashboard.netlify.app', 'haas-client.netlify.app'];

      if (config.env === 'local' || (origin && validOrigins.find((origin: string) => origin.endsWith(origin)))) {
        // callback(null, true);
      }
    },

    credentials: true,
  };

  app.get('/', async (req, res) => res.send({ status: 'HAAS API V2.1.0' }));
  app.get('/health', async (req, res) => res.send({ status: 'Health check' }));

  // Webhooks route
  app.post('/webhooks', async (req, res) => res.send('success'))
  app.use('/webhooks/delivery', DeliveryWebhookRoute);

  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  const apollo = await makeApollo(prismaClient, app);
  await apollo.start();
  await app.register(apollo.createHandler({ cors: false }));
  await app.listen(port);
  logger.logLifeCycle('Started the server!');
  // app.use('/graphql', apollo)
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
  return app.server;
};
