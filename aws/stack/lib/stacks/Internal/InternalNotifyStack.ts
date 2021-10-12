import * as cdk from '@aws-cdk/core';
import { SNSLambda } from '../../constructs/SNSLambda';
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as actions from "@aws-cdk/aws-cloudwatch-actions";
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as ecs from "@aws-cdk/aws-ecs";

interface HaasCampaignStackProps {
  accountId: string;
  secretSlackKey: string;
}

export class InternalNotifyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: HaasCampaignStackProps) {
    super(scope, id);

    const slackUrl = secretsmanager.Secret.fromSecretNameV2(
      this, 'SLACK_URL', props.secretSlackKey
    );

    const slackSender = new SNSLambda(this, 'SlackSender', {
      name: 'SlackSender',
      snsTopicName: 'InternalNotification',
      lambdaEntry: 'lib/stacks/Internal/InternalNotifyLambda/InternalNotifyLambda.ts',
      lambdaHandler: 'main',
    });
    slackUrl.grantRead(slackSender.lambda);

    const cpuMetric = new cloudwatch.Metric({
      namespace: 'AWS/ECS',
      metricName: 'CPUUtilization',
    }).createAlarm(this, 'CPUAlarm', {
      threshold: 50,
      evaluationPeriods: 15
    }).addAlarmAction(new actions.SnsAction(slackSender.snsTopic));
  }
}
