import {
  aws_iam as iam,
  aws_s3 as s3,
  aws_secretsmanager as secretsmanager,
  aws_lambda as lambdaFn,
  aws_lambda_destinations as destinations,
  Duration,
  aws_sqs as sqs,
  aws_sns as sns,
  aws_sns_subscriptions as snsSubs,
  Stack,
  aws_ssm as ssm,
  CfnOutput,
  aws_lambda_event_sources,
} from 'aws-cdk-lib'
import * as crpm from 'crpm';
import { Construct } from "constructs";
import { Handler, Runtime } from 'aws-cdk-lib/aws-lambda';
import { BaseLambdaService } from '../../../constructs/Base/BaseLambdaService';

const name = 'ReportCrawler';

interface ReportCrawlerServiceProps {
}

/**
 * Service for Report Crawler
 *
 * Prerequisites:
 * - A secret exists with the name "SecretOfAutomation" in secrets manager, and SECRETAUTOMATION_API_KEY
 * - We have a Lambda role `AllowLambdaAccessToS3AndSQS` in the workspace for automations.
 */
export class ReportCrawlerService extends BaseLambdaService {
  constructor(scope: Construct, id: string, props: ReportCrawlerServiceProps) {
    super(scope, id, { ...props, name });

    const bucket = this.createUploadBucket();
    const jwtSecret = this.getJWTKey();
    const lambdaRole = this.getLambdaRole();

    const lambdaImage = new lambdaFn.AssetImageCode(`${__dirname}/ReportCrawlerLambda/`, {
      exclude: ['node_modules', 'infra'],
      invalidation: {
        file: true,
      }
    });

    // Define a dead-letter-queue
    const invocationDlq = new sqs.Queue(this, `${name}_INVOCATION_DLQ`, {
      queueName: `${name}_INVOCATION_DLQ_queue`,
      retentionPeriod: Duration.days(14),
    });

    const lambda = new lambdaFn.Function(this, `${name}Lambda`, {
      code: lambdaImage,
      memorySize: 1920,
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      onFailure: new destinations.SqsDestination(invocationDlq),
      timeout: Duration.seconds(210),
      role: lambdaRole,
      tracing: lambdaFn.Tracing.ACTIVE,
      environment: {
        bucketName: bucket.ref,
        // TODO: Needs to be fetched inside lambda
        AUTOMATION_API_KEY: jwtSecret.secretValueFromJson('AUTOMATION_API_KEY').toString(),
      },
    });

    // Define a dead-letter-queue
    const dlq = new sqs.Queue(this, `${name}_DLQ`, {
      queueName: `${name}_DLQ_queue`,
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
    }));

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

    const canInvokeAllLambdasRole = new iam.Role(this, 'InvokeAllLambdas_Role', {
      roleName: 'InvokeAllLambdasRole',
      assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    })

    canInvokeAllLambdasRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:lambda:eu-central-1:*:function:*'],
      actions: ['lambda:InvokeFunction'],
      effect: iam.Effect.ALLOW,
    }));

    canInvokeAllLambdasRole.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:sns:eu-central-1:*:haasApiReport', 'arn:aws:sns:eu-central-1:*:dialogueLinkSender'],
      actions: ['sns:Publish'],
      effect: iam.Effect.ALLOW,
    }));

    const generateReportLambdaArnParam = new ssm.StringParameter(this, `${name}_ARN`, {
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
      description: 'The ARN of the role used by all EventBridge rules to execute automation lambdas',
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

    new CfnOutput(this, 'RunAllLambdasArnParam', { value: eventBridgeRunAllLambdasArnParam.parameterName })
    new CfnOutput(this, `${name}_SNSTopicName`, { value: snsTopic.topicName });
    new CfnOutput(this, `${name}_ExportBucket`, { value: bucket.ref });
    new CfnOutput(this, `${name}_LambdaName`, { value: lambda.functionName });
  }

  private getJWTKey() {
    const jwtSecret = secretsmanager.Secret.fromSecretNameV2(this,
      'AUTOMATION_API_KEY',
      'SecretOfAutomation',
    );

    return jwtSecret;
  }

  private createUploadBucket() {
    const bucketProps = crpm.load<s3.CfnBucketProps>(`${__dirname}/ReportCrawlerLambda/infra/res/storage/s3/bucket/props.yaml`);
    const bucket = new s3.CfnBucket(this, 'Bucket', bucketProps);

    return bucket;
  }

  /**
   * Fetches an existing role in the account with name `AllowLambdaAccessToS3AndSQS`.
   */
  private getLambdaRole() {
    const importedRole = iam.Role.fromRoleArn(
      this,
      'imported-role',
      `arn:aws:iam::${Stack.of(this).account}:role/AllowLambdaAccessToS3AndSQS`,
      { mutable: false },
    );

    return importedRole;
  }
}
