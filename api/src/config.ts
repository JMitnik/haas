require('dotenv').config();

export interface ConfigProps {
  env: string;
  port: number;
  endpoint: string;
  isDebug: boolean;
  clientUrl: string;
  dashboardUrl: string;
  cloudinaryUrl: string;
  prismaUrl: string;
  appSchemaUrl: string;
  prismaSchemaUrl: string;
  mailDefaultSender: string;
  mailServer: string;
  mailPort: number;
  mailUsername: string;
  mailPassword: string;
  prismaServiceSecret: string;
}

const config: ConfigProps = {
  env: process.env.ENVIRONMENT || 'local',
  port: Number(process.env.PORT) || 4000,
  endpoint: process.env.APP_ENDPOINT || '/graphql',
  isDebug: Boolean(process.env.ENABLE_DEBUG) || false,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3002',
  cloudinaryUrl: process.env.CLOUDINARY_URL || '',
  prismaUrl: process.env.PRISMA_SERVICE_ENDPOINT || 'http://localhost:4466',
  appSchemaUrl: process.env.PATH_TO_APP_SCHEMA || './src/schema.graphql',
  prismaSchemaUrl: process.env.PATH_TO_PRISMA_GENERATED_SCHEMA || './src/generated/prisma.graphql',
  mailServer: process.env.MAIL_SERVER || '',
  mailPort: Number(process.env.MAIL_PORT) || 22,
  mailUsername: process.env.MAIL_USERNAME || '',
  mailPassword: process.env.MAIL_PASSWORD || '',
  mailDefaultSender: process.env.MAIL_DEFAULT_SENDER || '',
  prismaServiceSecret: process.env.PRISMA_SERVICE_SECRET || '',
};

export default config;
