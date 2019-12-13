import { GraphQLServer, Options } from 'graphql-yoga';
import { Prisma, forwardTo } from 'prisma-binding';
import config from './config';
import { prisma } from '../../generated/prisma-client'

const resolvers = {
    Query: {
        users: forwardTo('db')
    }
};

const server: GraphQLServer = new GraphQLServer({
    typeDefs: 'schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'generated/prisma.graphql',
            endpoint: 'http://localhost:4466',
            secret: '123',
        })
    })
});

const serverOptions: Options = {
    port: config.APP_PORT,
    endpoint: config.END_POINT,
};

export const startServer = () => {
    server.start(serverOptions, ({ port }) => {
        console.log(`Starting server on port ${port}`);
    });
};

export default server;