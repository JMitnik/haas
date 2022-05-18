import {
  aws_ecs as ecs,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_rds as rds,
  aws_iam as iam,
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

  db: rds.DatabaseInstance;
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
          CLOUDINARY_URL: '',
          MAIL_SENDER: props.apiOptions.mailSenderMail,
          ENVIRONMENT: props.apiOptions.environment,
          test: 'test'
        },
        secrets: {
          DB_STRING: ecs.Secret.fromSecretsManager(dbUrlSecret, 'url'),
          JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
          API_SECRET: ecs.Secret.fromSecretsManager(apiSecret),
        },
      },
    });

    this.service = apiService.service;
    this.grantDatabasePermission(props.db);
    this.grantIAMPermissions();
  }

  /**
   * Grants all necessary permissions to access database.
   */
  grantDatabasePermission(db: rds.DatabaseInstance) {
    this.service.connections.allowTo(db, ec2.Port.tcp(5432), 'RDS Connection');
  }

  /**
   * Grants all necessary AWS IAM Permissions (for managed AWS services)
   * - Allows the API to send Emails using SES
   */
  grantIAMPermissions() {
    if (!this.service.taskDefinition.executionRole) return;

    // Grant permissions to send Emails usins SES
    this.service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:ses:eu-central-1:*:identity/*'],
      actions: ['ses:SendEmail'],
      effect: iam.Effect.ALLOW,
    }));
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

    const dbUrl = `postgresql://${databaseUserName}:${databasePasswordSecret.secretValueFromJson('password').toString()}@${databaseEndpoint}/postgres?schema=public`;

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
