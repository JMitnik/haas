import express from 'express';
import makeApollo from './apollo';
import config from './config';

const main = async () => {
  const apollo = await makeApollo();
  const app = express();

  apollo.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: [config.CLIENT_URL, config.DASHBOARD_URL],
    },
  });

  app.listen(config.APP_PORT);

  console.log(`Server successfully started on port ${config.APP_PORT} for graphql entrypoint at ${apollo.graphqlPath}`);
};

main();
