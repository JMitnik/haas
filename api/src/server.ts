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
      typeDefs: `${config.PATH_TO_PRISMA_GENERATED_SCHEMA}`,
      endpoint: `${config.PRISMA_ENDPOINT}`,
    }),
  }),
});

const serverOptions: Options = {
  port: config.APP_PORT,
  endpoint: config.ENDPOINT,
  cors: {
    credentials: true,
    origin: [config.FRONTEND_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
};

const startServer = () => {
  server.start(serverOptions, ({ port, cors }) => {
    console.log(`Starting server on port ${port}`);
    console.log(`Running with cors: ${cors}`);
  }).then(() => {
    console.log(`Running with port: ${serverOptions.port}!, endpoint: ${serverOptions.endpoint}`);
  });
};

export default startServer;
