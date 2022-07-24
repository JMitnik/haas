import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { Construct } from 'constructs';

interface CoreVPCProps {
  vpcName: string;
}

export class CoreVPC extends Construct {
  vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: CoreVPCProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, "CORE_VPC", {
      maxAzs: 2,
      vpcName: props.vpcName,
      subnetConfiguration: [
        {
          name: 'API_VPC_PUBLIC_DEFAULT',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'API_VPC_PRIVATE_DEFAULT',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    this.addAccessToS3();
    this.addAccessToSecretsManager();
    this.addAccessToSessionsManager();
  }

  private addAccessToS3() {
    // We allow our VPC Access to S3 this way.
    this.vpc.addGatewayEndpoint('S3Access', {
      service: ec2.GatewayVpcEndpointAwsService.S3
    });
  }

  private addAccessToSecretsManager() {
     // TODO: Find cheaper alternative
    // We allow our VPC Access to Secrets Manager this way.
    this.vpc.addInterfaceEndpoint('secretAccess', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER
    });
  }

  private addAccessToSessionsManager() {
    this.vpc.addInterfaceEndpoint('sessionAccess', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM
    });

    this.vpc.addInterfaceEndpoint('sessionMessageAccess', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES
    });

    this.vpc.addInterfaceEndpoint('EC2Access', {
      service: ec2.InterfaceVpcEndpointAwsService.EC2
    });

    this.vpc.addInterfaceEndpoint('EC2MessageAccess', {
      service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES
    });
  }
}
