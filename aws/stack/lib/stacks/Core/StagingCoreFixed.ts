import { App, Stack, StackProps, aws_route53 as route53, aws_certificatemanager as acm } from "aws-cdk-lib";

import { CoreDatabase } from "../../constructs/Core/Persistent/CoreDatabase";
import { CoreVPC } from "../../constructs/Core/Persistent/CoreVPC";
import { CoreAPI } from "../../constructs/Core/Ephemeral/CoreAPI";
import { stagingVariables } from './CoreVariables';
import { CoreRepo } from "../../constructs/Core/Persistent/CoreRepo";


export class StagingCoreFixed extends Stack {
  vpc: CoreVPC;
  repo: CoreRepo;
  db: CoreDatabase;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new CoreVPC(this, 'CORE_VPC', {
      vpcName: stagingVariables.vpcName,
    });

    this.db = new CoreDatabase(this, 'CORE_DATABASE', {
      databaseUsername: stagingVariables.databaseUsername,
      credentialsSecretName: stagingVariables.databasePasswordSecretName,
      vpc: this.vpc.vpc,
      databaseName: stagingVariables.databaseName,
    });

    this.repo = new CoreRepo(this, 'CORE_REPO', { repoName: stagingVariables.repoName });
  }
}
