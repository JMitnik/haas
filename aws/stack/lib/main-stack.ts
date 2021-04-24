import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as rds from '@aws-cdk/aws-rds';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { SubnetType } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import { TwilioHandlerService } from './lambdas/twilio-handler/twilio-handler-service';
import { Duration } from '@aws-cdk/core';


// Prerequisites:
// 1. You have an Ec2 Keyname-pair created (HaasAPI_RemoteBastionAccess)
// 2. You have a hosted-zone with haas.live and a hostedZoneId (if not, edit this).
// 3. You have a secret named HAAS_JWT for the API
// 4. You have a repository (in this case, `haas-svc-api`).
// 5. Some AWS access key (Temporarily, we should not rely on this tbh.)

// What to do after first deploy
// 1. Ensure the bastion is whitelisted in its security group
// 2. If new database, ensure you have a prisa role.

// Constants
const hostedZoneId = 'Z02703531WCURDDQ4Z46S';
const hostedZoneName = 'haas.live';
const bastionKeyName = 'HaasAPI_RemoteBastionAccess';

export class APIStack extends cdk.Stack {
  apiService: ecs_patterns.ApplicationLoadBalancedFargateService;
  dbUrl: string;
  vpc: ec2.Vpc;
  db: rds.DatabaseInstance;
  rdsPassword: secretsmanager.Secret;
  rdsSecurityGroup: ec2.SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Reference to our hosted-zone (haas.live)
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HaasLiveZone', {
      hostedZoneId,
      zoneName: hostedZoneName
    })

    // Certificate necessary for HTTPS registration of our API.
    const tlsCertificate = new acm.Certificate(this, 'HAASLiveCertificate', {
      domainName: 'api.haas.live',
      validation: acm.CertificateValidation.fromDns(hostedZone)
    });

    const svcRepo = ecr.Repository.fromRepositoryName(this, 'ServiceRepo', 'haas-svc-api');

    // Our VPC: private subnet for sensitive space such as DB, and public for our services and bastion
    const vpc = new ec2.Vpc(this, "API_VPC", {
      maxAzs: 2,
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

    // We allow our VPC Access to S3 this way.
    vpc.addGatewayEndpoint('S3Access', {
      service: ec2.GatewayVpcEndpointAwsService.S3
    });

    // TODO: Find cheaper alternative
    // We allow our VPC Access to Secrets Manager this way.
    vpc.addInterfaceEndpoint('secretAccess', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER
    });

    this.vpc = vpc;

    // We preconfigure our RDS credentials, and will upload this to `API_MAIN_RDS_SECRET`.
    const rdsUsername = 'HAAS_ADMIN';
    const rdsPassword = new secretsmanager.Secret(this, 'API_RDS_SECRET', {
      secretName: 'API_MAIN_RDS_SECRET'
    });

    this.rdsPassword = rdsPassword;

    // Our RDS Endpoint
    const rdsDb = new rds.DatabaseInstance(this, 'API_RDS', {
      vpc,
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      deletionProtection: false,
      storageType: rds.StorageType.GP2,
      vpcSubnets: { subnetType: SubnetType.ISOLATED },
      credentials: {
        username: rdsUsername,
        password: rdsPassword.secretValue,
      },
    });

    // Database endpoint
    const rdsEndpoint = rdsDb.instanceEndpoint.hostname;

    // Our ECS cluster, housing our various Fargate Services
    const cluster = new ecs.Cluster(this, "API_MAIN_CLUSTER", {
      vpc,
      clusterName: "API_MAIN_CLUSTER",
      containerInsights: true
    });

    // Environment values for our API service: access to DB and JWT.
    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this,
      'SecretFromName',
      'HAAS_JWT'
    );
    const dbUrl = `postgresql://${rdsUsername}:${rdsPassword.secretValue.toString()}@${rdsEndpoint}/postgres?schema=public`;

    const dbString = new secretsmanager.Secret(this, 'API_RDS_String', {
      secretName: 'API_RDS_String',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ url: dbUrl }),
        generateStringKey: 'SECRET_URL'
      }
    });

    const awsSecret = secretsmanager.Secret.fromSecretNameV2(this, 'API_KEY', 'ProdAwsKey');
    const autodeckAWSSecret = secretsmanager.Secret.fromSecretNameV2(this, 'API_KEY', 'prod/AutoDeckAWSKeys');

    // Our main API service; we will adjust this as necessary to deal with more load.
    const apiService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "API_SERVICE", {
      cluster,
      cpu: 512,
      memoryLimitMiB: 2048,
      desiredCount: 1,
      assignPublicIp: true,
      domainZone: hostedZone,
      domainName: 'api.haas.live',
      certificate: tlsCertificate,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(svcRepo),
        containerPort: 4000,
        environment: {
          BASE_URL: 'http://api.haas.live',
          CLIENT_URL: 'https://client.haas.live',
          DASHBOARD_URL: 'https://dashboard.haas.live',
          CLOUDINARY_URL: 'cloudinary://591617433181475:rGNg80eDICKoUKgzrMlSPQitZw8@dx8khik9g',
          MAIL_SENDER: 'noreply@haas.live',
          ENVIRONMENT: 'prod',
        },
        secrets: {
          DB_STRING: ecs.Secret.fromSecretsManager(dbString, 'url'),
          JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
          // TODO: Use IAM Roles instead, this is not reliable
          AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(awsSecret, 'AWS_ACCESS_KEY_ID'),
          AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(awsSecret, 'AWS_SECRET_ACCESS_KEY'),
          AUTODECK_AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(autodeckAWSSecret, 'AUTODECK_AWS_ACCESS_KEY_ID'),
          AUTODECK_AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(autodeckAWSSecret, 'AUTODECK_AWS_SECRET_ACCESS_KEY'),
        },
      },
    });

    // Setup AutoScaling policy
    const scaling = apiService.service.autoScaleTaskCount({ maxCapacity: 3 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60)
    });

    this.apiService = apiService;
    this.dbUrl = dbUrl;

    const rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDS_Access_Security_Group', {
      vpc,
      securityGroupName: 'RDS_SECURITY_GROUP',
    });

    this.rdsSecurityGroup = rdsSecurityGroup;

    // Public Bastion for accessing the database
    // Note: we will use the client to adjust the security-groups allowed ingress connections
    const remoteBastion = new ec2.Instance(this, 'API_VPC_BASTION', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      securityGroup: new ec2.SecurityGroup(this, 'API_VC_BASTION_SG', {
        vpc,
        securityGroupName: 'API_VC_BASTION_SG',
      }),
      keyName: bastionKeyName
    });

    this.db = rdsDb;

    // Who can access the database?
    rdsDb.connections.allowFrom(apiService.service, ec2.Port.tcp(5432));
    rdsDb.connections.allowFrom(remoteBastion, ec2.Port.tcp(5432));
    rdsDb.connections.allowFrom(rdsSecurityGroup, ec2.Port.tcp(5432));
  }
}
