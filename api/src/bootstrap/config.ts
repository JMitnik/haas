require('dotenv').config();

const config: any = {
    APP_PORT: process.env.APP_PORT || 4000,
    ENDPOINT: '/graphql',
    PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT,
    APP_SECRET: process.env.APP_SECRET
};

export default config;