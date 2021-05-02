import * as core from '@aws-cdk/core';
import * as lambdaCore from '@aws-cdk/aws-lambda';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as sqs from '@aws-cdk/aws-sqs';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as targets from '@aws-cdk/aws-events-targets';
import { getStageContextValues } from '../../helpers/getContextVariables';
import { DynamoEventSource, SqsDlq } from '@aws-cdk/aws-lambda-event-sources';
import { Rule, Schedule } from '@aws-cdk/aws-events';

export class DeliveryJobService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);
    const stage = this.node.tryGetContext('stage') ?? 'default';
    const stageVariables = getStageContextValues(this, stage);

    const dynamoTableName = stageVariables.services.campaign.deliveryTableName || 'TestTableName';

    const dynamoTable = new dynamodb.Table(this, 'CampaignDeliveriesTable', {
      tableName: dynamoTableName,
      partitionKey: {
        name: 'DeliveryDate', type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'DeliveryDate_DeliveryID', type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
    });

    const dlq = new sqs.Queue(this, 'DLQ');

    // Define the lambda which will respond to changes on the table
    const scheduleHandler = new lambda.NodejsFunction(this, 'CampaignDeliveriesScheduleHandler', {
      entry: 'functions/campaign-deliveries-schedule-handler/campaign-deliveries-schedule-handler.ts',
      handler: 'lambdaHandler',
      environment: { deliveryTableName: dynamoTableName }
    });

    new Rule(this, 'DeliveryScheduleRule', {
      schedule: Schedule.rate(core.Duration.minutes(1)),
      targets: [new targets.LambdaFunction(scheduleHandler)],
    });

    // Define the lambda which will respond to changes on the table
    const streamHandler = new lambda.NodejsFunction(this, 'CampaignDeliveriesStreamHandler', {
      entry: 'functions/campaign-deliveries-stream-handler/campaign-deliveries-stream-handler.ts',
      handler: 'lambdaHandler',
    });

    // Define the event source
    streamHandler.addEventSource(new DynamoEventSource(dynamoTable, {
      startingPosition: lambdaCore.StartingPosition.TRIM_HORIZON,
      batchSize: 30,
      retryAttempts: 5,
      bisectBatchOnError: true,
      onFailure: new SqsDlq(dlq),
    }));
  }
}