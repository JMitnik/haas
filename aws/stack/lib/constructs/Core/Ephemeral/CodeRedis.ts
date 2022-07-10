import {
  aws_ec2 as ec2,
  aws_elasticache as elasticache
} from 'aws-cdk-lib';
import { Construct } from 'constructs';


interface CoreRedisProps {
  vpc: ec2.Vpc;
}


export class CoreRedis extends Construct {
  cluster: elasticache.CfnCacheCluster;
  redisSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: CoreRedisProps) {
    super(scope, id);

    this.redisSecurityGroup = new ec2.SecurityGroup(this, 'RedisSecurityGroup', {
      description: 'Security group for redis',
      vpc: props.vpc,
      securityGroupName: 'RedisSecurityGroup',
    });

    const subnetIds = props.vpc.isolatedSubnets.map(net => net.subnetId);

    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroups', {
      description: 'Subnet group group for redis',
      subnetIds,
      tags: [{
        key: 'section',
        value: 'security'
      }],
    });


    this.cluster = new elasticache.CfnCacheCluster(this, 'CoreRedis', {
      engine: 'redis',
      cacheNodeType: 'cache.t3.small',
      numCacheNodes: 1,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      // Get all private subnets from Redis
      vpcSecurityGroupIds:[this.redisSecurityGroup.securityGroupId],
    })
  }
}
