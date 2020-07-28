import cors, { CorsOptions } from 'cors';
import express from 'express';

import config from './config';
import makeApollo from './apollo';

const main = async () => {
  const apollo = await makeApollo();
  const app = express();

  const corsOptions: CorsOptions = {
    // Hardcoded for the moment

    origin: (origin, callback) => {
      const validOrigins = ['dashboard.haas.live', 'client.haas.live', 'haas-dashboard.netlify.app', 'haas-client.netlify.app'];

      if (origin && validOrigins.find((origin: string) => origin.endsWith(origin))) {
        callback(null, true);
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));

  apollo.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(config.port);

  console.log(`Only intended to work on ${config.clientUrl} and ${config.dashboardUrl}`);
  console.log(`Server successfully started on port ${config.port} for graphql entrypoint at ${apollo.graphqlPath}`);
};

main();
