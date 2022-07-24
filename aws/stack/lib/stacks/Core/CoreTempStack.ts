import { Stack, aws_ec2 as ec2, aws_ecr as ecr, aws_rds as rds, App, StackProps } from "aws-cdk-lib";
import { IRepository } from "aws-cdk-lib/aws-ecr";
import { CoreRedis } from "../../constructs/Core/Ephemeral/CoreRedis";

import { CoreAPI, } from "../../constructs/Core/Ephemeral/CoreAPI";
import { CoreBastion } from "../../constructs/Core/Ephemeral/CoreBastion";
import { CoreVariables } from "./CoreVariables";

interface CoreTempProps extends StackProps {
  vpc: ec2.Vpc;
  repo: IRepository;
  db: rds.DatabaseInstance;
  dbSecurityGroup: ec2.SecurityGroup;
  variables: CoreVariables;
}

export class CoreTempStack extends Stack {
  constructor(stack: App, id: string, props: CoreTempProps) {
    super(stack, id, props);

    const redis = new CoreRedis(this, 'CORE_REDIS', {
      vpc: props.vpc,
    });

    const api = new CoreAPI(this, 'CORE_API', {
      databaseUserName: props.variables.databaseUsername,
      databaseCredentialSecretName: props.variables.databasePasswordSecretName,
      databaseEndpoint: props.db.instanceEndpoint.hostname,
      vpc: props.vpc,
      repo: props.repo,
      jwtSecretName: '',
      apiOptions: props.variables.api,
      dbSecurityGroup: props.dbSecurityGroup,
      domainName: props.variables.domainName,
      db: props.db,
      redis,
    });

    const bastion = new CoreBastion(this, 'CORE_BASTION', {
      vpc: props.vpc,
      dbSecurityGroup: props.dbSecurityGroup,
    });
  }
}
