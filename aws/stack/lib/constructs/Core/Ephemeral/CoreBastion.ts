import { aws_ec2 as ec2, aws_rds as rds, aws_iam as iam }  from 'aws-cdk-lib'
import { Construct } from "constructs";

interface CoreBastionProps {
  vpc: ec2.Vpc;
  dbSecurityGroup: ec2.SecurityGroup;
}

export class CoreBastion extends Construct {
  constructor(scope: Construct, id: string, props: CoreBastionProps) {
    super(scope, id);

    const bastion = new ec2.BastionHostLinux(this, 'CORE_Bastion', {
      vpc: props.vpc,
    });

    bastion.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    bastion.instance.addSecurityGroup(props.dbSecurityGroup);
  }
}
