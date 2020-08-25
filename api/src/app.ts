import cors, { CorsOptions } from 'cors';
import express from 'express';

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
  console.log(config.testString);
  console.log('🏳️\tStarting application');

  const apollo = await makeApollo();
  const app = express();

  process.on('SIGINT', () => {

  });

  const corsOptions: CorsOptions = {
    // Hardcoded for the moment
    origin: (origin, callback) => {
      const validOrigins = ['dashboard.haas.live', 'client.haas.live', 'haas-dashboard.netlify.app', 'haas-client.netlify.app'];

      if (config.env === 'local' || (origin && validOrigins.find((origin: string) => origin.endsWith(origin)))) {
        callback(null, true);
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));

  apollo.applyMiddleware({ app });

  console.log('🏳️\tStarting the server');

  app.listen(config.port);

  console.log('🏁\tStarted the server!');
};

try {
  main();
} catch (e) {
  console.log(e);
}
