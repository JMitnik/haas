import { GraphQLServer, Options } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import config from './config';
import resolvers from '../resolvers';

const server: GraphQLServer = new GraphQLServer({
    typeDefs: 'schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'generated/prisma.graphql',
            endpoint: `${config.PRISMA_ENDPOINT}`,
            secret: `${config.APP_SECRET}`,
        })
    })
});

const serverOptions: Options = {
    port: config.APP_PORT,
    endpoint: config.ENDPOINT,
};

export const startServer = () => {
    server.start(serverOptions, ({ port }) => {
        console.log(`Starting server on port ${port}`);
    });
};

export default server;
