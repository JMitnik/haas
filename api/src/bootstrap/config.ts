require('dotenv').config();

const config: any = {
    APP_PORT: process.env.APP_PORT || 4000,
    ENDPOINT: process.env.APP_ENDPOINT,
    PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT,
    APP_SECRET: process.env.APP_SECRET,

    PATH_TO_APP_SCHEMA: process.env.PATH_TO_APP_SCHEMA,
    PATH_TO_PRISMA_GENERATED_SCHEMA: process.env.PATH_TO_PRISMA_GENERATED_SCHEMA,
};

console.log(config);

export default config;