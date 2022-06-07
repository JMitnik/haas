import { Stack, aws_ec2 as ec2, aws_ecr as ecr, aws_rds as rds, App, StackProps } from "aws-cdk-lib";
import { Automations } from '../../constructs/Core/Ephemeral/Automations';

export class StagingAutomations extends Stack {
  constructor(stack: App, id: string) {
    super(stack, id);

    const automations = new Automations(this, 'AUTOMATIONS');
  }
}
