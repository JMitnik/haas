import { Stack, aws_ec2 as ec2, aws_ecr as ecr, App } from "aws-cdk-lib";
import { CoreAPI, } from "../../constructs/Core/Ephemeral/CoreAPI";
import { variables } from "./CoreVariables";

interface StagingCoreTempProps {
  vpc: ec2.Vpc;
  repo: ecr.Repository;
  databaseEndpoint: string;
}

export class StagingCoreTemp extends Stack {
  constructor(stack: App, id: string, props: StagingCoreTempProps) {
    super(stack, id);

    const api = new CoreAPI(this, 'CORE_API', {
      databaseUserName: variables.databaseUsername,
      databaseEndpoint: props.databaseEndpoint,
      databaseCredentialSecretName: variables.databasePasswordSecretName,
      vpc: props.vpc,
      repo: props.repo,
      jwtSecretName: '',
      apiOptions: variables.api,
    });
  }
}
