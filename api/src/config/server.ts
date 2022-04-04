import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import Fastify from 'fastify';
import ExpressPlugin from 'fastify-express';
import MultiPartPlugin from 'fastify-multipart';
import CookiePlugin from 'fastify-cookie';

import { processRequest } from 'graphql-upload';

import DeliveryWebhookRoute from '../routes/webhooks/DeliveryWebhookRoute';
import { makeApollo } from './apollo';
import config from './config';

export const makeServer = async (port: number, prismaClient: PrismaClient) => {
  console.log('🏳️\tStarting application');
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

  const apollo = await makeApollo(prismaClient, app);

  // if (config.useSSL) {
  //   const key: any = process.env.HTTPS_SERVER_KEY_PATH;
  //   const certificate: any = process.env.HTTPS_SERVER_CERT_PATH;

  //   https.createServer({
  //     key: fs.readFileSync(key),
  //     cert: fs.readFileSync(certificate),
  //   }, app).listen(port, () => {
  //     console.log('🏁\Listening on https server!');
  //     console.log(`Listening on port ${port}!`);
  //   });
  // }

  await apollo.start();
  await app.register(apollo.createHandler({ cors: false }));

  await app.listen(port);
  console.log('🏁\Listening on standard server!');
  console.log('🏁\tStarted the server!');

  return app.server;
};
