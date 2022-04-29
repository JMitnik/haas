import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import https from 'https';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

import DeliveryWebhookRoute from '../routes/webhooks/DeliveryWebhookRoute';
import { makeApollo } from './apollo';
import config from './config';

export const makeServer = async (port: number, prismaClient: PrismaClient) => {
  console.log('🏳️\tStarting application');
  const app = express();

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

  app.get('/', (req, res, next) => { res.json({ status: 'HAAS API V2.1.0' }); });
  app.get('/health', (req, res, next) => { res.json({ status: 'Health check' }); });

  // Webhooks route
  app.post('/webhooks', express.json(), async (req, res) => { res.send('success'); });
  app.use('/webhooks/delivery', DeliveryWebhookRoute);

  app.use(cookieParser());
  app.use(cors(corsOptions));

  // Add /graphql and graphqlUploadExpress
  const apollo = await makeApollo(prismaClient);
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

  app.use('/graphql', apollo)
  // apollo.applyMiddleware({ app });

  if (config.useSSL) {
    const key: any = process.env.HTTPS_SERVER_KEY_PATH;
    const certificate: any = process.env.HTTPS_SERVER_CERT_PATH;

    https.createServer({
      key: fs.readFileSync(key),
      cert: fs.readFileSync(certificate),
    }, app).listen(port, () => {
      console.log('🏁\Listening on https server!');
      console.log(`Listening on port ${port}!`);
    });
  }

  const serverInstance = app.listen(port);
  console.log('🏁\Listening on standard server!');
  console.log('🏁\tStarted the server!');

  return serverInstance;
};
