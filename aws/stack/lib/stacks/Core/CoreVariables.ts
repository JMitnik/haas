export interface CoreVariables {
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
    baseUrl: 'https://api.staging.haas.live',
    clientUrL: 'https://client.staging.haas.live',
    dashboardUrl: 'https://dashboard.staging.haas.live',
    mailSenderMail: 'noreply@staging.haas.live',
    environment: 'staging',
  },
}

export const prodVariables: CoreVariables = {
  env: 'production',
  vpcName: 'CORE_VPC',
  domainName: 'haas.live',
  databaseName: 'CORE_DB',
  databaseUsername: 'HAAS_ADMIN',
  databasePasswordSecretName: 'CORE_DATABASE_PASSWORD_V2',
  repoName: 'haas_core_repo_prod',
  api: {
    baseUrl: 'https://api.haas.live',
    clientUrL: 'https://www.client.haas.live',
    dashboardUrl: 'https://www.dashboard.haas.live',
    mailSenderMail: 'hello@haas.live',
    environment: 'production',
  },
}
