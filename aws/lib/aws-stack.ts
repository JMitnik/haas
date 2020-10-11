import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as rds from '@aws-cdk/aws-rds';

export class AwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'HAAS_VPC', {
      maxAzs: 2,
      natGateways: 0,
    });

    const cluster = new ecs.Cluster(this, 'HAAS_API_CLUSTER', {
      vpc,
    });

    const fargate = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'HAAS_FARGATE_SERVICE', {
      cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ecr.Repository.fromRepositoryName(this, 'HAAS_API_REPOSITORY', 'haas')),
        containerPort: 4000,
        containerName: 'HAAS_API_CONTAINER',
      },
      publicLoadBalancer: true,
    });
  }
}
