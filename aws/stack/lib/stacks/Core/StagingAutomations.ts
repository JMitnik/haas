import { Stack, aws_ec2 as ec2, aws_ecr as ecr, aws_rds as rds, App, StackProps } from "aws-cdk-lib";
import { Automations } from '../../constructs/Core/Ephemeral/Automations';

interface StagingAutomationsProps extends StackProps {
  vpc: ec2.Vpc;
  repo: ecr.Repository;
  db: rds.DatabaseInstance;
  dbSecurityGroup: ec2.SecurityGroup;
}

export class StagingAutomations extends Stack {
  constructor(stack: App, id: string, props: StagingAutomationsProps) {
    super(stack, id, props);

    const automations = new Automations(this, 'AUTOMATIONS', {
      dbSecurityGroup: props.dbSecurityGroup,
      db: props.db,
      vpc: props.vpc,
    });

  }
}
