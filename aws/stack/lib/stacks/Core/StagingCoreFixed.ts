import { App, Stack, StackProps } from "aws-cdk-lib";

import { CoreDatabase } from "../../constructs/Core/Persistent/CoreDatabase";
import { CoreVPC } from "../../constructs/Core/Persistent/CoreVPC";
import { CoreAPI } from "../../constructs/Core/Ephemeral/CoreAPI";
import { variables } from './CoreVariables';
import { CoreRepo } from "../../constructs/Core/Persistent/CoreRepo";


export class StagingCoreFixed extends Stack {
  vpc: CoreVPC;
  repo: CoreRepo;
  databaseEndpoint: string;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new CoreVPC(this, 'CORE_VPC', {
      vpcName: variables.vpcName,
    });

    const database = new CoreDatabase(this, 'CORE_DATABASE', {
      databaseUsername: variables.databaseUsername,
      credentialsSecretName: variables.databasePasswordSecretName,
      vpc: this.vpc.vpc,
    });
    this.databaseEndpoint = database.endpoint;

    this.repo = new CoreRepo(this, 'CORE_REPO', { repoName: variables.repoName });
  }
}
