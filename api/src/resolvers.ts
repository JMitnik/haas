import { forwardTo } from 'prisma-binding';

const resolvers = {
    Query: {
        questions: forwardTo('db'),
        topics: forwardTo('db'),
    },
};

export default resolvers;