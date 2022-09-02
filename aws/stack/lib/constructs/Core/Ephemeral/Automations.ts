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
  Stack,
  aws_events as events,
  aws_events_targets as eventTargets,
  aws_ssm as ssm,
  CfnOutput,
  aws_lambda_event_sources,
} from 'aws-cdk-lib'
import * as cdk from '@aws-cdk/core';
import * as crpm from 'crpm';
import { Construct } from "constructs";
import { Handler, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HaasDialogueLinkHandleService } from '../../../lambdas/haas-dialogue-link-handler/haas-dialogue-link-handle-service';

const name = 'Puppeteer'

export class Automations extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucketProps = crpm.load<s3.CfnBucketProps>(`${__dirname}/Automations/infra/res/storage/s3/bucket/props.yaml`);
    const bucket = new s3.CfnBucket(this, 'Bucket', bucketProps);

    // const dockerImage = new ecra.DockerImageAsset(this, 'DockerImage', { directory: `${__dirname}/Automations/`, exclude: ['node_modules', 'infra'], });

    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this,
      'AUTOMATION_API_KEY',
      'SecretOfAutomation',
    );

    // const fnRoleProps = crpm.load<iam.CfnRoleProps>(`${__dirname}/Automations/infra/res/security-identity-compliance/iam/role-lambda/props.yaml`);
    // const fnRole = new iam.CfnRole(this, 'LambdaRole', fnRoleProps);

    // const appFnProps = crpm.load<lambda.CfnFunctionProps>(`${__dirname}/Automations/infra/res/compute/lambda/function-puppeteer/props.yaml`);


    // appFnProps.code = {
    //   imageUri: dockerImage.imageUri,
    // };
    // appFnProps.role = fnRole.attrArn;
    // appFnProps.environment = {
    //   variables: {
    //     bucketName: bucket.ref,
    //     AUTOMATION_API_KEY: jwtSecret.secretValueFromJson('AUTOMATION_API_KEY').toString(),
    //   },
    // }

    // const appFn = new lambda.CfnFunction(this, 'PuppeteerFunction', appFnProps);

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
        new iam.AccountPrincipal(Stack.of(this).account),
      ],
    }))

    /** Define an SQS Queue */
    const sqsQueue = new sqs.Queue(this, `${name}_SQS`, {
      visibilityTimeout: Duration.seconds(240),
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 1,
      },
    })

    /** Let SQS listen to SNS */
    const sqsListener = new snsSubs.SqsSubscription(sqsQueue, {
      deadLetterQueue: dlq,
      rawMessageDelivery: true,
    });
    snsTopic.addSubscription(sqsListener);

    /** Turn SQS into an event source */
    const sqsEventSource = new aws_lambda_event_sources.SqsEventSource(sqsQueue, {
      batchSize: 1
    });

    /** Link SQS to Lambda */
    lambda.addEventSource(sqsEventSource);

    new HaasDialogueLinkHandleService(this, 'HaasDialogueLinkHandleService', {
      AUTOMATION_API_KEY: jwtSecret.secretValueFromJson('AUTOMATION_API_KEY').toString()
    });

    const canInvokeAllLambdasRole = new iam.Role(this, 'invoke-all-lambdas-role', {
      roleName: 'InvokeAllLambdasRole',
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    })

    canInvokeAllLambdasRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:lambda:eu-central-1:*:function:*'],
      actions: ['lambda:InvokeFunction'],
      effect: iam.Effect.ALLOW,
    }));

    canInvokeAllLambdasRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:sns:eu-central-1:*:haasApiReport'],
      actions: ['sns:Publish'],
      effect: iam.Effect.ALLOW,
    }));

    const generateReportLambdaArnParam = new ssm.StringParameter(this, 'generate-report-lambda-arn', {
      parameterName: 'GenerateReportLambdaArn',
      stringValue: snsTopic.topicArn,
      description: 'the arn of the lambda used to generate reports',
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

    const eventBridgeDLQ = new sqs.Queue(this, `${name}_EventBridge_DLQ`, {
      queueName: `${name}_EventBridge_DLQ`,
    });

    // Allow the Eventbridge Lambda role to send Messages to the DLQ.
    canInvokeAllLambdasRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [eventBridgeDLQ.queueArn],
      actions: ['sqs:SendMessage',],
      effect: iam.Effect.ALLOW,
    }));

    const eventBridgeRunAllLambdasArnParam = new ssm.StringParameter(this, 'EventBridgeRunAllLambdasRole_ARN', {
      parameterName: 'EventBridgeRunAllLambdasRoleArn',
      stringValue: canInvokeAllLambdasRole.roleArn,
      description: 'the arn of the role used by all EventBridge rules to execute automation lambdas',
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

    new CfnOutput(this, 'LambdaPuppeteerFunctionName', { value: app2Fn.functionName });
    new CfnOutput(this, 'Sns', { value: snsTopic.topicName });
    new CfnOutput(this, 'BucketName', { value: bucket.ref });
    new CfnOutput(this, 'RunAllLambdasArnParam', { value: eventBridgeRunAllLambdasArnParam.parameterName })
  }
}
