interface CoreVariables {
  vpcName: string;

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

export const variables: CoreVariables = {
  vpcName: 'CORE_VPC',
  databaseUsername: 'HAAS_ADMIN',
  databasePasswordSecretName: 'CORE_DATABASE_PASSWORD',
  repoName: 'haas_core_repo',
  api: {
    baseUrl: 'https://staging.api.haas.live',
    clientUrL: 'https://staging.client.haas.live',
    dashboardUrl: 'https://staging.dashboard.haas.live',
    mailSenderMail: 'noreply@haas.live',
    environment: 'staging',
  },
}
