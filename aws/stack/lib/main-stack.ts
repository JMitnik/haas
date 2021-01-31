import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { SubnetType } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";

const pathToAPI = '/Users/jonathanmitnik/Developer/haas/code/api';
const hostedZoneId = 'Z02703531WCURDDQ4Z46S';
const hostedZoneName = 'haas.live';

export class APIStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HaasLiveZone', {
      hostedZoneId,
      zoneName: hostedZoneName
    })

    const tlsCertificate = new acm.Certificate(this, 'HAASLiveCertificate', {
      domainName: 'api.haas.live',
      validation: acm.CertificateValidation.fromDns(hostedZone)
    });

    const vpc = new ec2.Vpc(this, "API_VPC", {
      maxAzs: 3,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'API_VPC_PUBLIC_DEFAULT',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'API_VPC_PRIVATE_DEFAULT',
          subnetType: SubnetType.ISOLATED,
        },
      ],
    });

    const rdsUsername = 'HAAS_ADMIN';
    const rdsPassword = new secretsmanager.Secret(this, 'API_RDS_SECRET', {
      secretName: 'API_MAIN_RDS_SECRET'
    });

    const rdsDb = new rds.DatabaseInstance(this, 'API_RDS', {
      vpc,
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      deletionProtection: false,
      storageType: rds.StorageType.GP2,
      vpcSubnets: { subnetType: SubnetType.ISOLATED },
      credentials: {
        username: rdsUsername,
        password: rdsPassword.secretValue
      }
    });

    const rdsEndpoint = rdsDb.instanceEndpoint.hostname;

    const cluster = new ecs.Cluster(this, "API_MAIN_CLUSTER", {
      vpc,
      clusterName: "API_MAIN_CLUSTER",
      containerInsights: true
    });

    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this, 'SecretFromName', 'HAAS_JWT');
    const dbUrl = `postgresql://${rdsUsername}:${rdsPassword.secretValue.toString()}@${rdsEndpoint}/postgres?schema=public`;

    const apiService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "API_SERVICE", {
      cluster,
      cpu: 256,
      desiredCount: 1,
      assignPublicIp: true,
      domainZone: hostedZone,
      domainName: 'api.haas.live',
      certificate: tlsCertificate,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(pathToAPI),
        containerPort: 4000,
        environment: {
          JWT_SECRET: jwtSecret.secretValue.toString(),
          DB_STRING: dbUrl
        }
      },
    });

    rdsDb.connections.allowFrom(apiService.service, ec2.Port.tcp(5432));
  }
}
