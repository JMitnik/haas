import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as snsSubs from '@aws-cdk/aws-sns-subscriptions';
import { Duration } from '@aws-cdk/core';

const name = 'HAAS_API_HANDLE';

export class HaasAPIHandleService extends core.Construct {
  url: string;

  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    // Define a dead-letter-queue
    const dlq = new sqs.Queue(this, `${name}_DLQ`, {
      queueName: `${name}_DLQ_queue`,
      retentionPeriod: core.Duration.days(14),
    });

    // Define a dead-letter-queue
    const dlqLambda = new sqs.Queue(this, `${name}_LAMBDA_DLQ`, {
      queueName: `${name}_DLQ_LAMBDA`,
      retentionPeriod: core.Duration.days(14),
    });

    // Define the `sender` lambda (sending end), and pass the relevant params.
    const haasApiLambda = new lambda.NodejsFunction(this, `${name}-sender`, {
      entry: 'lib/lambdas/haas-api-handler/haas-api-sender.ts',
      handler: 'main',
      timeout: Duration.seconds(60),
      deadLetterQueue: dlqLambda
    });

    // SNS Subscription
    const snsTopic = new sns.Topic(this, `${name}_SNS_Topic`, {
      displayName: 'HAAS API Handle Topic',
      topicName: `haasApiMessage`,
    });

    // Define a subscription wrapper for the sender
    const snsLambdaSubscription = new snsSubs.LambdaSubscription(haasApiLambda, {
      deadLetterQueue: dlq,
    });

    snsTopic.addSubscription(snsLambdaSubscription);
  }
}
