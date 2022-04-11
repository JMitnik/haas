interface CoreVariables {
  env: string;
  vpcName: string;
  domainName: string;

  databaseName: string;
  databaseUsername: string;
  databasePasswordSecretName: string;

  repoName: string;

  api: APIOptions;
}

export interface APIOptions {
  baseUrl: string;
  clientUrL: string;
  dashboardUrl: string;
  mailSenderMail: string;
  environment: string;
}

export const stagingVariables: CoreVariables = {
  env: 'staging',
  vpcName: 'CORE_VPC',
  domainName: 'staging.haas.live',
  databaseName: 'CORE_DB_Staging',
  databaseUsername: 'HAAS_ADMIN',
  databasePasswordSecretName: 'CORE_DATABASE_PASSWORD_V2',
  repoName: 'haas_core_repo',
  api: {
    baseUrl: 'https://staging.api.haas.live',
    clientUrL: 'https://staging.client.haas.live',
    dashboardUrl: 'https://staging.dashboard.haas.live',
    mailSenderMail: 'noreply@staging.haas.live',
    environment: 'staging',
  },
}
