import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import fs from 'fs';
import https from 'https';

import config from './config/config';
import makeApollo from './config/apollo';

process.on('SIGINT', () => {
  console.log('received sigint');
  setTimeout(() => {
    console.log('exit');
    process.exit(0);
  }, 100);
});

const main = async () => {
  const apollo = await makeApollo();
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

  app.use(cookieParser());
  app.use(cors(corsOptions));

  apollo.applyMiddleware({ app, cors: false });

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
    console.log(`🌐\tListening on standard server, using port ${config.port}!`);
  }
  console.log('🏁\tStarted the server!');
  console.log('=======================');
};

try {
  console.log('🏃‍♂️\tStarting app');
  main();
} catch (e) {
  console.log(e);
}
