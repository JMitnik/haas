import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';

const pathToAPI = '/Users/jonathanmitnik/Developer/haas/code/api/Dockerfile'

export class MainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "HAAS_MAIN_VPC", {
      maxAzs: 3,
      natGateways: 0
    });

    const cluster = new ecs.Cluster(this, "HAAS_MAIN_CLUSTER", {
      vpc,
      clusterName: "HAAS_MAIN_CLUSTER",
      containerInsights: true
    });

    const fargateApi = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "HAAS_MAIN_API", {
      cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(),
      },
    });
  }
}
