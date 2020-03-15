import express from 'express';
import cors from 'cors';
import makeApollo from './apollo';
import config from './config';

const main = async () => {
  const apollo = await makeApollo();
  const app = express();
  apollo.applyMiddleware({
    app,
    cors: {
      origin: [config.CLIENT_URL, config.DASHBOARD_URL],
    },
  });
  app.use(cors());
  app.listen(config.APP_PORT);

  // App

  console.log(`Server successfully started on port ${config.APP_PORT}`);
};

main();
