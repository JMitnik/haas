require('dotenv').config();

export interface ConfigProps {
  jwtSecret: string;
  jwtExpiryMinutes: number;
  env: string;
  port: number;
  useSSL: boolean;
  endpoint: string;
  isDebug: boolean;
  clientUrl: string;
  dashboardUrl: string;
  cloudinaryUrl: string;
  prismaUrl: string;
  appSchemaUrl: string;
  prismaSchemaUrl: string;
  mailSender: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  prismaServiceSecret: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  testString: string;
}

if (!process.env.JWT_SECRET) throw new Error('Ensure you set a JWT secret in your env');
if (!process.env.MAIL_SENDER) console.log('Mail sender not defined; wont send mails as a result');

const config: ConfigProps = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiryMinutes: 30,
  env: process.env.ENVIRONMENT || 'local',
  port: Number(process.env.PORT) || 4000,
  useSSL: Boolean(process.env.useSSL) || false,
  endpoint: process.env.APP_ENDPOINT || '/graphql',
  isDebug: Boolean(process.env.ENABLE_DEBUG) || false,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3002',
  cloudinaryUrl: process.env.CLOUDINARY_URL || '',
  prismaUrl: process.env.PRISMA_SERVICE_ENDPOINT || 'http://localhost:4466',
  appSchemaUrl: process.env.PATH_TO_APP_SCHEMA || './src/schema.graphql',
  prismaSchemaUrl: process.env.PATH_TO_PRISMA_GENERATED_SCHEMA || './src/generated/prisma.graphql',
  mailSender: process.env.MAIL_SENDER || '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  prismaServiceSecret: process.env.PRISMA_SERVICE_SECRET || '',
  twilioAccountSid: process.env.SMS_ACCOUNT_SID || '',
  twilioAuthToken: process.env.SMS_AUTH_TOKEN || '',
  testString: new Date().toUTCString(),
};

export default config;
