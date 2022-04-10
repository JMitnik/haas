import { aws_rds as rds, aws_ec2 as ec2 } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface CoreDatabaseProps {
  databaseUsername: string;
  /** Name under which to store the database password credentials. */
  credentialsSecretName: string;

  /** VPC to place the database in. */
  vpc: ec2.Vpc;
}

export class CoreDatabase extends Construct {
  rdsDb: rds.DatabaseInstance;
  endpoint: string;

  constructor(scope: Construct, id: string, props: CoreDatabaseProps) {
    super(scope, id);

    this.rdsDb = new rds.DatabaseInstance(this, 'API_RDS', {
      vpc: props.vpc,
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      deletionProtection: true,
      storageType: rds.StorageType.GP2,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      credentials: rds.Credentials.fromGeneratedSecret(props.databaseUsername, {
        // TODO: is this unqiue per account?
        secretName: props.credentialsSecretName
      }),
    });

    this.endpoint = this.rdsDb.instanceEndpoint.hostname;
  }
}
