import {
  aws_ecs as ecs,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_secretsmanager as secretsmanager,
  aws_ecs_patterns as ecs_patterns
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { APIOptions } from '../../../stacks/Core/CoreVariables';

interface CoreApiProps {
  vpc: ec2.Vpc;
  repo: ecr.Repository,
  databaseEndpoint: string;
  databaseUserName: string;
  databaseCredentialSecretName: string;
  jwtSecretName: string;

  apiOptions: APIOptions;
}

export class CoreAPI extends Construct {

  constructor(scope: Construct, id: string, props: CoreApiProps) {
    super(scope, id);

    const vpc = props.vpc;

     // Our ECS cluster, housing our various Fargate Services
    const cluster = new ecs.Cluster(this, "CORE_CLUSTER", {
      vpc,
      clusterName: "CORE_CLUSTER",
      containerInsights: true
    });

    // TODO: Are we generating this every time?
    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this,
      'SecretFromName',
      'HAAS_JWT'
    );

    const databasePasswordSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'DatabaseSecretForCoreAPI',
      props.databaseCredentialSecretName
    );

    const dbUrl = `postgresql://${props.databaseUserName}:${databasePasswordSecret.secretValue.toString()}@${props.databaseEndpoint}/postgres?schema=public`;

    // Our main API service; we will adjust this as necessary to deal with more load.
    const apiService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "API_SERVICE", {
      cluster,
      cpu: 512,
      memoryLimitMiB: 2048,
      desiredCount: 1,
      assignPublicIp: true,
      // domainZone: hostedZone,
      // domainName: 'api.haas.live',
      // certificate: tlsCertificate,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(props.repo),
        containerPort: 4000,
        environment: {
          BASE_URL: props.apiOptions.baseUrl,
          CLIENT_URL: props.apiOptions.clientUrL,
          DASHBOARD_URL: props.apiOptions.dashboardUrl,
          CLOUDINARY_URL: 'cloudinary://591617433181475:rGNg80eDICKoUKgzrMlSPQitZw8@dx8khik9g',
          MAIL_SENDER: props.apiOptions.mailSenderMail,
          ENVIRONMENT: props.apiOptions.environment,
        },
        secrets: {
          // DB_STRING: ecs.Secret.fromSecretsManager(dbUrl, 'url'),
          // JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
          // TODO: Use IAM Roles instead, this is not reliable
          // AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(awsSecret, 'AWS_ACCESS_KEY_ID'),
          // AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(awsSecret, 'AWS_SECRET_ACCESS_KEY'),
          // AUTODECK_AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(autodeckAWSSecret, 'AUTODECK_AWS_ACCESS_KEY_ID'),
          // AUTODECK_AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(autodeckAWSSecret, 'AUTODECK_AWS_SECRET_ACCESS_KEY'),
        },
      },
    });
  }
}
