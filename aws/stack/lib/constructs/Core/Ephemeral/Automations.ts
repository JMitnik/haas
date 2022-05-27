import {
  aws_ec2 as ec2,
  aws_rds as rds,
  aws_iam as iam,
  aws_s3 as s3,
  aws_ecr_assets as ecra,
  aws_secretsmanager as secretsmanager,
  aws_lambda as lambda,
  Duration,
  aws_sqs as sqs,
  aws_sns as sns,
  aws_sns_subscriptions as snsSubs,
  CfnOutput,
  Stack,
} from 'aws-cdk-lib'
import * as cdk from '@aws-cdk/core';
import * as crpm from 'crpm';
import { Construct } from "constructs";
import { Handler, Runtime } from 'aws-cdk-lib/aws-lambda';

interface StagingAutomationProps {
  vpc: ec2.Vpc;
  db: rds.DatabaseInstance;
  dbSecurityGroup: ec2.SecurityGroup;
}

const name = 'Puppeteer'

export class Automations extends Construct {
  constructor(scope: Construct, id: string, props: StagingAutomationProps) {
    super(scope, id);

    const bucketProps = crpm.load<s3.CfnBucketProps>(`${__dirname}/Automations/infra/res/storage/s3/bucket/props.yaml`);
    const bucket = new s3.CfnBucket(this, 'Bucket', bucketProps);

    const dockerImage = new ecra.DockerImageAsset(this, 'DockerImage', { directory: `${__dirname}/Automations/`, exclude: ['node_modules', 'infra'], });

    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this,
      'AUTOMATION_API_KEY',
      'SecretOfAutomation',
    );

    const fnRoleProps = crpm.load<iam.CfnRoleProps>(`${__dirname}/Automations/infra/res/security-identity-compliance/iam/role-lambda/props.yaml`);
    const fnRole = new iam.CfnRole(this, 'LambdaRole', fnRoleProps);

    const appFnProps = crpm.load<lambda.CfnFunctionProps>(`${__dirname}/Automations/infra/res/compute/lambda/function-puppeteer/props.yaml`);


    appFnProps.code = {
      imageUri: dockerImage.imageUri,
    };
    appFnProps.role = fnRole.attrArn;
    appFnProps.environment = {
      variables: {
        bucketName: bucket.ref,
        AUTOMATION_API_KEY: jwtSecret.secretValueFromJson('AUTOMATION_API_KEY').toString(),
      },
    }

    const appFn = new lambda.CfnFunction(this, 'PuppeteerFunction', appFnProps);

    // 👇 import existing IAM Role
    const importedRole = iam.Role.fromRoleArn(
      this,
      'imported-role',
      `arn:aws:iam::${Stack.of(this).account}:role/AllowLambdaAccessToS3AndSQS`,
      { mutable: false },
    );

    const imageRepresentation = new lambda.AssetImageCode(`${__dirname}/Automations/`, {
      exclude: ['node_modules', 'infra'], invalidation: {
        file: true,
      }
    });

    const app2Fn = new lambda.Function(this, 'PuppeteerFunctionTwo', {
      code: imageRepresentation,
      memorySize: 1920,
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      timeout: Duration.seconds(210),
      role: importedRole,
      environment: {
        bucketName: bucket.ref,
        AUTOMATION_API_KEY: jwtSecret.secretValueFromJson('AUTOMATION_API_KEY').toString(),
      },
    });

    // Define a dead-letter-queue
    const dlq = new sqs.Queue(this, `${name}_DLQ`, {
      queueName: `${name}_DLQ_queue`,
      retentionPeriod: Duration.days(14),
    });

    // Define a dead-letter-queue
    const dlqLambda = new sqs.Queue(this, `${name}_LAMBDA_DLQ`, {
      queueName: `${name}_DLQ_LAMBDA`,
      retentionPeriod: Duration.days(14),
    });

    // SNS Subscription
    const snsTopic = new sns.Topic(this, `${name}_SNS_Topic`, {
      displayName: 'HAAS API Generate Report Topic',
      topicName: `haasApiReport`,
    });

    //   senderHandler.role?.addToPrincipalPolicy(new iam.PolicyStatement({
    //     resources: [`arn:aws:ssm:eu-central-1:${props.accountId}:parameter/TWILIO_CALLBACK_URL`],
    //     effect: iam.Effect.ALLOW,
    //     actions: ['ssm:GetParameter']
    // }));

    console.log('topic name: ', snsTopic.topicArn);
    snsTopic.addToResourcePolicy(new iam.PolicyStatement({
      resources: [snsTopic.topicArn],
      actions: [
        "SNS:GetTopicAttributes",
        "SNS:SetTopicAttributes",
        "SNS:AddPermission",
        "SNS:RemovePermission",
        "SNS:DeleteTopic",
        "SNS:Subscribe",
        "SNS:ListSubscriptionsByTopic",
        "SNS:Publish"
      ],
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.AccountRootPrincipal(),
        new iam.AccountPrincipal('356797133903'), // FIXME: Moet gefixed (dit is StagingCoreTemp en zal dus niet werken in productie)
        new iam.AccountPrincipal('649621042808'), //TODO: Moet gefixed (dit is Jonathan's accountId)
        new iam.AccountPrincipal(cdk.Stack.of(this).account),
      ],
    }))

    // Define a subscription wrapper for the sender
    const snsLambdaSubscription = new snsSubs.LambdaSubscription(app2Fn, {
      deadLetterQueue: dlq,
    });

    snsTopic.addSubscription(snsLambdaSubscription);

    new CfnOutput(this, 'ECRImageURI', { value: dockerImage.imageUri });
    new CfnOutput(this, 'LambdaFunctionName', { value: appFn.ref });
    new CfnOutput(this, 'LambdaPuppeteerFunctionName', { value: app2Fn.functionName });
    new CfnOutput(this, 'Sns', { value: snsTopic.topicName });
    new CfnOutput(this, 'BucketName', { value: bucket.ref });
  }
}
