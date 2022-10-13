import {
  aws_ecs as ecs,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  Stack,
  aws_rds as rds,
  aws_iam as iam,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_secretsmanager as secretsmanager,
  aws_ecs_patterns as ecs_patterns,
  Duration,
  aws_ssm as ssm,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IRepository } from "aws-cdk-lib/aws-ecr";

import { APIOptions } from '../../../stacks/Core/CoreVariables';
import { CoreRedis } from './CoreRedis';

interface CoreApiProps {
  vpc: ec2.Vpc;
  repo: IRepository,
  domainName: string;
  databaseEndpoint: string;
  databaseUserName: string;
  databaseCredentialSecretName: string;
  jwtSecretName: string;

  redis: CoreRedis;
  db: rds.DatabaseInstance;
  dbSecurityGroup: ec2.SecurityGroup;
  apiOptions: APIOptions;
}

/**
 * CoreAPI construct.
 *
 * Preconditions:
 * - Ensure a LUMIGO_TRACER_TOKEN secret is set.
 */
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
    const lumigoTracerSecret = secretsmanager.Secret.fromSecretNameV2(
      this, 'LUMIGO_TRACER_TOKEN', 'LUMIGO_TRACER_TOKEN'
    );

    const runAllLambdasEventBridgeRoleArn = ssm.StringParameter.fromStringParameterName(
      this,
      'ImportedEventBridgeRoleArn',
      'EventBridgeRunAllLambdasRoleArn'
    );

    const generateReportLambdaArn = ssm.StringParameter.fromStringParameterName(
      this,
      'ImportedGenerateReportLambdaArn',
      'GenerateReportLambdaArn'
    );

    const sendDialogueLinkLambdaArn = ssm.StringParameter.fromStringParameterName(
      this,
      'ImportedDialogueLinkLambdaArn',
      'DialogueLinkSender_Arn'
    );

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
          CLOUDINARY_URL: 'cloudinary://934926832132984:uwtZjMqTGKgJL-nFzS2gsG_pnUE@haas-storage',
          MAIL_SENDER: props.apiOptions.mailSenderMail,
          REDIS_URL: props.redis.cluster.attrRedisEndpointAddress,
          ENVIRONMENT: props.apiOptions.environment,
          AWS_ACCOUNT_ID: Stack.of(this).account,
          EVENT_BRIDGE_RUN_ALL_LAMBDAS_ROLE_ARN: runAllLambdasEventBridgeRoleArn.stringValue,
          GENERATE_REPORT_LAMBDA_ARN: generateReportLambdaArn.stringValue,
          SEND_DIALOGUE_LINK_LAMBDA_ARN: sendDialogueLinkLambdaArn.stringValue,
        },
        secrets: {
          DB_STRING: ecs.Secret.fromSecretsManager(dbUrlSecret, 'url'),
          JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
          API_SECRET: ecs.Secret.fromSecretsManager(apiSecret),
          LUMIGO_TRACER_TOKEN: ecs.Secret.fromSecretsManager(lumigoTracerSecret),
        },
      },
    });

    this.service = apiService.service;
    this.grantDatabasePermission(props.db);
    this.grantIAMPermissions();
    this.grantRedisPermission(props.redis);
  }

  /**
   * Grants all necessary permissions to access database.
   */
  private grantDatabasePermission(db: rds.DatabaseInstance) {
    this.service.connections.allowTo(db, ec2.Port.tcp(5432), 'RDS Connection');
  }

  /**
   * Grants all permissions to access redis
   */
  private grantRedisPermission(redis: CoreRedis) {
    this.service.connections.allowTo(redis.redisSecurityGroup, ec2.Port.tcp(6379), 'Allow redis connection');
  }

  /**
   * Grants all necessary AWS IAM Permissions (for managed AWS services)
   * - Allows the API to send Emails using SES
   */
  private grantIAMPermissions() {
    if (!this.service.taskDefinition.executionRole) return;

    // Grant permissions to send Emails usins SES
    this.service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:ses:eu-central-1:*:identity/*'],
      actions: ['ses:SendEmail'],
      effect: iam.Effect.ALLOW,
    }));

    // TODO: Make more scalable
    // Grand SNS permissions to generate API reports.
    this.service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:sns:eu-central-1:*:haasApiReport'],
      actions: ['sns:Publish'],
      effect: iam.Effect.ALLOW,
    }));

    this.service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:events:eu-central-1:*:event-bus/*'],
      actions: [
        'events:*',
      ],
      effect: iam.Effect.ALLOW,
    }));

    this.service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:events:eu-central-1:*:rule/*'],
      actions: [
        'events:*',
      ],
      effect: iam.Effect.ALLOW,
    }));

    this.service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:iam::*:role/*'],
      actions: [
        'iam:PassRole',
      ],
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
