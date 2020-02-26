import { GraphQLServer, Options } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import config from './config';
import resolvers from './resolvers';

const server: GraphQLServer = new GraphQLServer({
  typeDefs: `${config.PATH_TO_PRISMA_GENERATED_SCHEMA}`,
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      typeDefs: config.PATH_TO_PRISMA_GENERATED_SCHEMA,
      endpoint: config.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SERVICE_SECRET,
    }),
  }),
});

const serverOptions: Options = {
  port: config.APP_PORT,
  endpoint: config.ENDPOINT,
  cors: {
    credentials: true,
    origin: config.FRONTEND_URL,
  },
};

const startServer = () => {
  server.start(serverOptions, ({ port, cors }) => {
    console.log(`Starting server on port ${port}`);
    console.log(`Running with cors for origin: ${cors && cors.origin}`);
    console.log(`URL for FRONTEND is here: ${config.FRONTEND_URL}`);
  }).then(() => {
    console.log(`Running with port: ${serverOptions.port}!, endpoint: ${serverOptions.endpoint}`);
  });
};

export default startServer;
