import { GraphQLServer, Options } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import config from './config';
import resolvers from '../resolvers';

const server: GraphQLServer = new GraphQLServer({
    typeDefs: `${config.PATH_TO_PRISMA_GENERATED_SCHEMA}`,
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: `${config.PATH_TO_PRISMA_GENERATED_SCHEMA}`,
            endpoint: `${config.PRISMA_ENDPOINT}`,
        })
    }),
});

const serverOptions: Options = {
    port: config.APP_PORT,
    endpoint: config.ENDPOINT
};

export const startServer: any = () => {
    server.start(serverOptions, ({ port }) => {
        console.log(`Starting server on port ${port}`);
    }).then(() => {
      console.log(`Running with port: ${serverOptions.port}!, endpoint: ${serverOptions.endpoint}`)
    });
};
