import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import fs from 'fs';
import https from 'https';
import { graphqlUploadExpress } from 'graphql-upload';

import AWS from './config/aws';
import config from './config/config';
import makeApollo from './config/apollo';
import { CampaignService } from './models/Campaigns/CampaignService';

process.on('SIGINT', () => {
  console.log('received sigint');
  setTimeout(() => {
    console.log('exit');
    process.exit(0);
  }, 100);
});

const main = async () => {
  console.log(config.testString);
  console.log('🏳️\tStarting application');

  const apollo = await makeApollo();
  const app = express();
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

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

  app.get('/', (req, res, next) => {
    console.log(`The length of the env variable is ${config.jwtSecret.length}`);

    res.json({ status: 'HAAS API V2.1.0' });
  });

  app.get('/health', (req, res, next) => {
    res.json({ status: 'Health check' });
  });

  app.get('/test', async (req, res, next) => {
    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    const result = await (dynamoClient.query({
      TableName: 'CampaignDeliveries',
      KeyConditionExpression: 'DeliveryDate = :dddd',
      ExpressionAttributeValues: {
        ':dddd': '26022021'
      }
    }).promise());

    res.json({ nrItems: result?.Items?.length });
  });

  app.post('/webhooks', bodyParser.json(), async (req: any, res: any, next: any) => {
    res.send('success');
  });

  app.post('/webhooks/delivery', bodyParser.json(), async (req: any, res: any, next: any) => {
    try {
      await CampaignService.updateBatchDeliveryStatus(req.body);
      res.status(200).end();
    } catch(e) {
      console.error(req.body);
      // @ts-ignore
      res.status(400).send(e.toString()).end();
    }
  });

  app.use(cookieParser());
  app.use(cors(corsOptions));

  apollo.applyMiddleware({ app, cors: false, });

  console.log('🏳️\tStarting the server');
  if (config.useSSL) {
    const key: any = process.env.HTTPS_SERVER_KEY_PATH;
    const certificate: any = process.env.HTTPS_SERVER_CERT_PATH;

    https.createServer({
      key: fs.readFileSync(key),
      cert: fs.readFileSync(certificate),
    }, app).listen(config.port, () => {
      console.log('🏁\Listening on https server!');
      console.log(`Listening on port ${config.port}!`);
    });
  } else {
    app.listen(config.port);
    console.log('🏁\Listening on standard server!');
  }
  console.log('🏁\tStarted the server!');
};

try {
  console.log('Starting app');
  main();
} catch (e) {
  console.log(e);
}
