import {
  aws_lambda_nodejs,
  Duration,
  aws_cloudwatch as cloudwatch,
  aws_sqs as sqs,
  aws_sns_subscriptions as snsSubs,
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
   * Adds a dead letter queue if the SNS deployment fails to send to the lambda.
   */
  protected addDLQ(lambda: aws_lambda_nodejs.NodejsFunction) {
    // Define a dead-letter-queue
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
