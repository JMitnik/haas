import {
  aws_lambda_nodejs,
  Duration,
  aws_cloudwatch as cloudwatch,
  aws_sqs as sqs,
  aws_iam as iam,
  aws_sns as sns,
  aws_sns_subscriptions as snsSubs,
  aws_lambda_event_sources,
  Stack,
} from "aws-cdk-lib";
import { Color } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";

interface BaseLambdaServiceProps {
  name: string;
}

export class BaseLambdaService extends Construct {
  name: string;

  constructor(scope: Construct, id: string, props: BaseLambdaServiceProps) {
    super(scope, id);
    this.name = props.name;
  }

  /**
   * Attaches an SNS to SQS to Lambda connection. This allows for clean fan-out principles.
   */
  protected addSQS(topicName: string, lambda: aws_lambda_nodejs.NodejsFunction) {
    /** Starting input: SNS Topic. */
    const snsTopic = new sns.Topic(this, `${this.name}_SNS_Topic`, {
      displayName: topicName,
      topicName,
    });

    /** Enable this account to perform particular actions on the SNS topic. */
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

    /** DLQ purely for the SQS messages.  */
    const dlq = new sqs.Queue(this, `${this.name}_SQS_DLQ`, {
      queueName: `${this.name}_DLQ_queue`,
      retentionPeriod: Duration.days(14),
    });

    /** Define an SQS Queue which will be the intermediate between Lambda and SNS. */
    const sqsQueue = new sqs.Queue(this, `${this.name}_SQS`, {
      visibilityTimeout: Duration.seconds(240),
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 1,
      },
    })

    /** Connect SQS to SNS, such that messages from SNS are played through to SQS. */
    const sqsListener = new snsSubs.SqsSubscription(sqsQueue, {
      deadLetterQueue: dlq,
      rawMessageDelivery: true,
    });
    snsTopic.addSubscription(sqsListener);

    /** Turn SQS into an event source (requirement for linking to lambda). */
    const sqsEventSource = new aws_lambda_event_sources.SqsEventSource(sqsQueue, {
      batchSize: 1
    });

    /** Link SQS to the Lambda */
    lambda.addEventSource(sqsEventSource);
  }

  /**
   * Adds a dead letter queue if the SNS deployment fails to send to the lambda.
   */
  protected addDLQ(lambda: aws_lambda_nodejs.NodejsFunction) {
    /** Define a dead-letter-queue for the actual lambda invocations. */
    const dlq = new sqs.Queue(this, `${this.name}_DLQ`, {
      queueName: `${this.name}_SNS_DLQ_queue`,
      retentionPeriod: Duration.days(14),
    });

    new snsSubs.LambdaSubscription(lambda, {
      deadLetterQueue: dlq,
    });
  }
  /**
   * Adds error logging to the `lambda`.
   *
   * Logs:
   * - Error rate
   */
  protected addErrorLogging(lambda: aws_lambda_nodejs.NodejsFunction) {
    const errors = lambda.metricErrors({
      period: Duration.seconds(60),
    });

    const invocations = lambda.metricInvocations({
      period: Duration.seconds(60),
    });

    // Create error rate alarm.
    new cloudwatch.Alarm(this, `${this.name}-ErrorRate`, {
      threshold: 1,
      evaluationPeriods: 1,
      metric: new cloudwatch.MathExpression({
        expression: '(errors / invocations) * 100',
        label: 'Lambda error rate',
        color: Color.RED,
        usingMetrics: {
          errors,
          invocations,
        }
      })
    })
  }
}
