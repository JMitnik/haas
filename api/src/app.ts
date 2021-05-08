import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import https from 'https';

import config from './config/config';
import makeApollo from './config/apollo';
import { routes } from './routes/routes';
import { corsOptions } from './config/cors';

process.on('SIGINT', () => {
  console.log('received sigint');
  setTimeout(() => {
    console.log('exit');
    process.exit(0);
  }, 100);
});

/**
 * Starts the server
 */
const main = async () => {
  console.log('🏳️\tStarting application');

  // Set up the GraphQL Server
  const apollo = await makeApollo();

  // Define the Express App and its routes
  const app = express();
  routes(app);

  // Apply middlewares: parse cookies, cors, and set GraphQL endpoint
  app.use(cookieParser());
  app.use(cors(corsOptions));
  apollo.applyMiddleware({ app, cors: false });

  if (config.useSSL) {
    const key = process.env.HTTPS_SERVER_KEY_PATH as string;
    const certificate = process.env.HTTPS_SERVER_CERT_PATH as string;

    https.createServer({
      key: fs.readFileSync(key),
      cert: fs.readFileSync(certificate),
    }, app).listen(config.port, () => {
      console.log('🏁\Listening on https server!');
      console.log(`Listening on port ${config.port}!`);
    });
  } else {
    app.listen(config.port);
    console.log('👂\tListening on standard server!');
  }
  console.log('🏃‍♂️\tStarted the server!');
};

try {
  main();
} catch (e) {
  console.log(e);
}
