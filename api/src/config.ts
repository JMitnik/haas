require('dotenv').config();

const config: any = {
  ENVIRONMENT: process.env.ENVIRONMENT || 'local',
  APP_PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  ENDPOINT: process.env.APP_ENDPOINT || '/graphql',
  PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
  APP_SECRET: process.env.APP_SECRET,
  PATH_TO_APP_SCHEMA: process.env.PATH_TO_APP_SCHEMA || './src/schema.graphql',
  PATH_TO_PRISMA_GENERATED_SCHEMA:
    process.env.PATH_TO_PRISMA_GENERATED_SCHEMA || './src/generated/prisma.graphql',
};

export default config;
