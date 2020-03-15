import express from 'express';
import makeApollo from './apollo';
import config from './config';

const main = async () => {
  const apollo = await makeApollo();
  const app = express();

  apollo.applyMiddleware({
    app,
    path:
    cors: {
      credentials: true,
      origin: [config.CLIENT_URL, config.DASHBOARD_URL],
    },
  });

  app.use(function(req: any, res: any, next: any) {
      const allowedOrigins = [config.CLIENT_URL, config.DASHBOARD_URL],

      const origin = req.headers.origin;

      if (allowedOrigins.indexOf(origin) > -1){
            res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', true);

      return next();
  });
  app.listen(config.APP_PORT);

  console.log(`Only intended to work on ${config.CLIENT_URL} and ${config.DASHBOARD_URL}`);
  console.log(`Server successfully started on port ${config.APP_PORT} for graphql entrypoint at ${apollo.graphqlPath}`);
};

main();
