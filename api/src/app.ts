import cors, { CorsOptions } from 'cors';
import express from 'express';

import config from './config';
import makeApollo from './apollo';

const main = async () => {
  const apollo = await makeApollo();
  const app = express();

  const corsOptions: CorsOptions = {
    origin: [config.clientUrl, config.dashboardUrl],
    credentials: true,
  };

  app.use(cors(corsOptions));

  apollo.applyMiddleware({
    app,
    cors: corsOptions,
  });

  app.listen(config.port);

  console.log(`Only intended to work on ${config.clientUrl} and ${config.dashboardUrl}`);
  console.log(`Server successfully started on port ${config.port} for graphql entrypoint at ${apollo.graphqlPath}`);
};

main();
