import { Stack, aws_ec2 as ec2, aws_ecr as ecr, aws_rds as rds, App, StackProps } from "aws-cdk-lib";
import { CoreAPI, } from "../../constructs/Core/Ephemeral/CoreAPI";
import { CoreBastion } from "../../constructs/Core/Ephemeral/CoreBastion";
import { stagingVariables } from "./CoreVariables";

interface StagingCoreTempProps extends StackProps {
  vpc: ec2.Vpc;
  repo: ecr.Repository;
  db: rds.DatabaseInstance;
  dbSecurityGroup: ec2.SecurityGroup;
}

export class StagingCoreTemp extends Stack {
  constructor(stack: App, id: string, props: StagingCoreTempProps) {
    super(stack, id, props);

    const api = new CoreAPI(this, 'CORE_API', {
      databaseUserName: stagingVariables.databaseUsername,
      databaseCredentialSecretName: stagingVariables.databasePasswordSecretName,
      databaseEndpoint: props.db.instanceEndpoint.hostname,
      vpc: props.vpc,
      repo: props.repo,
      jwtSecretName: '',
      apiOptions: stagingVariables.api,
      dbSecurityGroup: props.dbSecurityGroup,
      domainName: stagingVariables.domainName,
    });

    const bastion = new CoreBastion(this, 'CORE_BASTION', {
      vpc: props.vpc,
      dbSecurityGroup: props.dbSecurityGroup,
    });
  }
}
