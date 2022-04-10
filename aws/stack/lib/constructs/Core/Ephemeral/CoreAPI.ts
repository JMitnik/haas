import {
  aws_ecs as ecs,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_secretsmanager as secretsmanager,
  aws_ecs_patterns as ecs_patterns,
  Duration
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { APIOptions } from '../../../stacks/Core/CoreVariables';

interface CoreApiProps {
  vpc: ec2.Vpc;
  repo: ecr.Repository,
  domainName: string;
  databaseEndpoint: string;
  databaseUserName: string;
  databaseCredentialSecretName: string;
  jwtSecretName: string;

  dbSecurityGroup: ec2.SecurityGroup;
  apiOptions: APIOptions;
}

export class CoreAPI extends Construct {
  service: ecs.FargateService;

  constructor(scope: Construct, id: string, props: CoreApiProps) {
    super(scope, id);

    const vpc = props.vpc;

     // Our ECS cluster, housing our various Fargate Services
    const cluster = new ecs.Cluster(this, "CORE_CLUSTER", {
      vpc,
      clusterName: "CORE_CLUSTER",
      containerInsights: true
    });

    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this, 'CORE_JWT_SECRET', 'JWT_SECRET');
    const apiSecret = secretsmanager.Secret.fromSecretNameV2(this, 'CORE_API_SECRET', 'API_SECRET');

    const dbUrlSecret = this.syncDatabaseUrlSecret(
      props.databaseEndpoint,
      props.databaseUserName,
      props.databaseCredentialSecretName
    );

    // Reference to our hosted-zone (haas.live)
    const hostedZone = route53.HostedZone.fromLookup(this, 'haasHostedZone', {
      domainName: props.domainName,
    });

    // Certificate necessary for HTTPS registration of our API.
    const tlsApiCertificate = new acm.Certificate(this, 'HAASLiveCertificate', {
      domainName: `api.${props.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Our main API service; we will adjust this as necessary to deal with more load.
    const apiService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "API_SERVICE", {
      cluster,
      cpu: 512,
      memoryLimitMiB: 2048,
      desiredCount: 1,
      assignPublicIp: true,
      domainZone: hostedZone,
      domainName: `api.${props.domainName}`,
      certificate: tlsApiCertificate,
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
          DB_STRING: ecs.Secret.fromSecretsManager(dbUrlSecret, 'url'),
          JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
          API_SECRET: ecs.Secret.fromSecretsManager(apiSecret),
          // TODO: Use IAM Roles instead, this is not reliable
          // AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(awsSecret, 'AWS_ACCESS_KEY_ID'),
          // AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(awsSecret, 'AWS_SECRET_ACCESS_KEY'),
          // AUTODECK_AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(autodeckAWSSecret, 'AUTODECK_AWS_ACCESS_KEY_ID'),
          // AUTODECK_AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(autodeckAWSSecret, 'AUTODECK_AWS_SECRET_ACCESS_KEY'),
        },
      },
    });

    this.service = apiService.service;
    apiService.loadBalancer.addSecurityGroup(props.dbSecurityGroup);
    // apiService.service.connections.addSecurityGroup(props.dbSecurityGroup);
    // apiService.
  }

  /**
   * Retrieve password from Database, formulate a URL, and sync it up again.
   */
  syncDatabaseUrlSecret(databaseEndpoint: string, databaseUserName: string, databaseCredentialSecretName: string) {
    const databasePasswordSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'DatabaseSecretForCoreAPI',
      databaseCredentialSecretName
    );

    const dbUrl = `postgresql://${databaseUserName}:${databasePasswordSecret.secretValue.toJSON().password}@${databaseEndpoint}/postgres?schema=public`;

    const dbStringSecret = new secretsmanager.Secret(this, 'API_RDS_String', {
      secretName: 'API_RDS_String',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ url: dbUrl }),
        generateStringKey: 'SECRET_URL'
      }
    });

    return dbStringSecret;
  }

  /**
   * Enables scaling up when is necessary.
   */
  enableScaling() {
    const scaling = this.service.autoScaleTaskCount({ maxCapacity: 3 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60)
    });
  }
}
