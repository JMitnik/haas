import express from 'express';
import cors, { CorsOptions } from 'cors';
import makeApollo from './apollo';
import config from './config';

const main = async () => {
  const apollo = await makeApollo();
  const app = express();

  const corsOptions: CorsOptions = {
    origin: [config.CLIENT_URL, config.DASHBOARD_URL],
    credentials: true,
  };

  app.use(cors(corsOptions));

  apollo.applyMiddleware({
    app,
    cors: corsOptions,
  });

  app.listen(config.APP_PORT);

  console.log(`Only intended to work on ${config.CLIENT_URL} and ${config.DASHBOARD_URL}`);
  console.log(`Server successfully started on port ${config.APP_PORT} for graphql entrypoint at ${apollo.graphqlPath}`);
};

main();
