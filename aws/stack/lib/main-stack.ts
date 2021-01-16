import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { SubnetType } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";

const pathToAPI = '/Users/jonathanmitnik/Developer/haas/code/api'

export class MainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "HAAS_MAIN_VPC", {
      maxAzs: 3,
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

    const cluster = new ecs.Cluster(this, "HAAS_MAIN_CLUSTER", {
      vpc,
      clusterName: "HAAS_MAIN_CLUSTER",
      containerInsights: true
    });

    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this, 'SecretFromName', 'HAAS_JWT');

    const fargateApi = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "HAAS_MAIN_API", {
      cluster,
      cpu: 256,
      desiredCount: 1,
      assignPublicIp: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(pathToAPI),
        environment: {
          JWT_SECRET: jwtSecret.secretValue.toString()
        }
      },
    });
  }
}
