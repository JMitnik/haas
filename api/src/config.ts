require('dotenv').config();

const config: any = {
  ENVIRONMENT: process.env.ENVIRONMENT || 'local',
  APP_PORT: process.env.PORT,
  ENABLE_DEBUG: process.env.ENABLE_DEBUG || false,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  DASHBOARD_URL: process.env.DASHBOARD_URL || 'http://localhost:3000',
  ENDPOINT: process.env.APP_ENDPOINT || '/graphql',
  PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
  APP_SECRET: process.env.APP_SECRET,
  PATH_TO_APP_SCHEMA: process.env.PATH_TO_APP_SCHEMA || './src/schema.graphql',
  PATH_TO_PRISMA_GENERATED_SCHEMA:
    process.env.PATH_TO_PRISMA_GENERATED_SCHEMA || './src/generated/prisma.graphql',
};

export default config;
