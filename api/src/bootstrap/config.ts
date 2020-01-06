require('dotenv').config();

const config: any = {
    APP_PORT: process.env.APP_PORT || 4000,
    ENDPOINT: process.env.APP_ENDPOINT || '/graphql',
    PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
    APP_SECRET: process.env.APP_SECRET,

    PATH_TO_APP_SCHEMA: process.env.PATH_TO_APP_SCHEMA || './src/schema.graphql',
    PATH_TO_PRISMA_GENERATED_SCHEMA: process.env.PATH_TO_PRISMA_GENERATED_SCHEMA || './src/generated/prisma.graphql',
};

console.log(config);

export default config;
