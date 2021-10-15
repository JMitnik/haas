import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as actions from "@aws-cdk/aws-cloudwatch-actions";
import * as events from "@aws-cdk/aws-events";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as eventsTargets from "@aws-cdk/aws-events-targets";

interface DeliverySchedulerConstructProps {
  accountId: string;
  secretSlackKey: string;
}

/**
 * This construct creates the necessary elements for the scheduled checking of Deliveries.
 *
 * Creates:
 * - An EventsBridge rule that runs every 2 minutes.
 * - A Lambda function that gets invoked by the rule. This lambda requires read and write permission by the dynamo-table.
 *
 * Pre-conditions:
 * - A table has been created in the current environment, called CampaignTable.
 */
export class DeliverySchedulerConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props?: DeliverySchedulerConstructProps) {
    super(scope, id);

    const lambdaFn = new lambda.NodejsFunction(this, `${id}_LAMBDA`, {
      entry: 'lib/stacks/DeliveryScheduler/DeliverySchedulerLambda.ts',
      handler: 'lambdaHandler',
      timeout: cdk.Duration.seconds(60),
    });

    const dynamoTable = dynamo.Table.fromTableName(this, 'CampaignTable', 'CampaignDeliveries');
    dynamoTable.grantReadWriteData(lambdaFn);

    const eventRule = new events.Rule(this, 'DeliveryScheduleRate', {
      description: 'The frequency of checking newly SCHEDULED deliveries',
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
      targets: [new eventsTargets.LambdaFunction(lambdaFn)]
    });
  }
}
