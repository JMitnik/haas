import { App, Stack, StackProps, aws_route53 as route53, aws_certificatemanager as acm } from "aws-cdk-lib";

import { CoreDatabase } from "../../constructs/Core/Persistent/CoreDatabase";
import { CoreVPC } from "../../constructs/Core/Persistent/CoreVPC";
import { CoreVariables } from './CoreVariables';
import { CoreRepo } from "../../constructs/Core/Persistent/CoreRepo";

interface CoreFixedProps extends StackProps {
  variables: CoreVariables;
};


export class CoreFixed extends Stack {
  vpc: CoreVPC;
  repo: CoreRepo;
  db: CoreDatabase;

  constructor(scope: App, id: string, props: CoreFixedProps) {
    super(scope, id, props);

    this.vpc = new CoreVPC(this, 'CORE_VPC', {
      vpcName: props.variables.vpcName,
    });

    this.db = new CoreDatabase(this, 'CORE_DATABASE', {
      databaseUsername: props.variables.databaseUsername,
      credentialsSecretName: props.variables.databasePasswordSecretName,
      vpc: this.vpc.vpc,
      databaseName: props.variables.databaseName,
    });

    this.repo = new CoreRepo(this, 'CORE_REPO', { repoName: props.variables.repoName });
  }
}
