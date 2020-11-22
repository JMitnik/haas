import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import { CfnDeletionPolicy } from '@aws-cdk/core';
import { StorageType } from '@aws-cdk/aws-rds';
import { SubnetType } from '@aws-cdk/aws-ec2';

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'HAAS_VPC', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'HAAS_VPC_PUBLIC_DEFAULT',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'HAAS_VPC_PRIVATE_DEFAULT',
          subnetType: SubnetType.ISOLATED,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, 'HAAS_API_CLUSTER', {
      vpc,
    });

    const dbSG = new ec2.SecurityGroup(this, 'DatabaseSecurity', {
      vpc,
    });

    const remoteSg = new ec2.SecurityGroup(this, 'RemoteAccess', {
      vpc,
      description: 'Access for remote access',
    });

    remoteSg.addIngressRule(ec2.Peer.ipv4('184.170.253.110/25'), ec2.Port.tcp(22));

    dbSG.addIngressRule(remoteSg, ec2.Port.tcp(5432));

    const db = new rds.DatabaseInstance(this, 'HAAS_DB', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      vpc,
      deletionProtection: true,
      storageType: StorageType.GP2,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    }).connections.addSecurityGroup(dbSG);

    const remoteBastion = new ec2.Instance(this, 'HAAS_BASTION', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    }).connections.addSecurityGroup(remoteSg);

    // const fargate = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'HAAS_FARGATE_SERVICE', {
    //   cluster,
    //   cpu: 256,
    //   desiredCount: 1,
    //   taskImageOptions: {
    //     image: ecs.ContainerImage.fromEcrRepository(ecr.Repository.fromRepositoryName(this, 'HAAS_API_REPOSITORY', 'haas')),
    //     containerPort: 4000,
    //     containerName: 'HAAS_API_CONTAINER',
    //   },
    //   publicLoadBalancer: true,
    // });
  }
}
