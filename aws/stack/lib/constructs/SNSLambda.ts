import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as snsSubs from '@aws-cdk/aws-sns-subscriptions';
import { Duration } from '@aws-cdk/core';
import { SqsDestination } from '@aws-cdk/aws-lambda-destinations';

interface SNSLambdaProps {
  name: string;
  lambdaEntry: string;
  lambdaHandler: string;
  snsTopicName: string;
  environment?: any;
}

export class SNSLambda extends core.Construct {
  lambda: lambda.NodejsFunction
  snsTopic: sns.Topic

  constructor(scope: core.Construct, id: string, props: SNSLambdaProps) {
    super(scope, id);

    // Define a SNS DLQ
    const snsDlq = new sqs.Queue(this, `${props.name}_SNS_DLQ`, {
      queueName: `${props.name}_SNS_DLQ`,
      retentionPeriod: core.Duration.days(14),
    });

    // Define a lambda DLQ
    const lambdaDLQ = new sqs.Queue(this, `${props.name}_LAMBDA_DLQ`, {
      queueName: `${props.name}_LAMBDA_DLQ`,
      retentionPeriod: core.Duration.days(14),
    });

    // Define the lambda itself
    this.lambda = new lambda.NodejsFunction(this, `${props.name}_LAMBDA`, {
      entry: props.lambdaEntry,
      handler: props.lambdaHandler,
      timeout: Duration.seconds(60),
      onFailure: new SqsDestination(lambdaDLQ),
      deadLetterQueue: lambdaDLQ,
      environment: props.environment
    });

    // SNS Subscription
    this.snsTopic = new sns.Topic(this, `${props.name}_SNS`, {
      displayName: `${props.name} topic`,
      topicName: `${props.snsTopicName}`,
    });

    // Define a subscription wrapper for the sender
    const snsLambdaSubscription = new snsSubs.LambdaSubscription(this.lambda, {
      deadLetterQueue: snsDlq,
    });
    this.snsTopic.addSubscription(snsLambdaSubscription);
  }
}
