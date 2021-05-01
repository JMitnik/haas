import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as snsSubs from '@aws-cdk/aws-sns-subscriptions';
import { getStageContextValues } from '../../helpers/getContextVariables';

export class TwilioHandlerService extends core.Construct {
  url: string;

  constructor(scope: core.Construct, id: string) {
    super(scope, id);
    const stage = this.node.tryGetContext('stage') ?? 'default';
    const stageVariables = getStageContextValues(this, stage);

    const ssmParameterName = `TWILIO_CALLBACK_URL_${stage}`;

    const postApi = new apigateway.RestApi(this, 'handle-twilio-api');

    // Synchronize the TWILIO_CALLBACK_URL parameter in SSM with the API gateway
    new ssm.StringParameter(this, 'API_URL', {
      stringValue: postApi.url,
      parameterName: 'TWILIO_RES_CALLBACK_URL',
    });

    // Get Twilio secrets from the secrets-manager
    const twilioSecret = secretsmanager.Secret.fromSecretNameV2(this, 'Twilio_SECRET', 'TWILIO_PROD');

    // Define the `handler` lambda (receiving end)
    const callbackHandler = new lambda.NodejsFunction(this, 'twilio-handler', {
      entry: 'functions/twilio-handler/twilio-handler.ts',
      handler: 'twilioHandler',
    });

    // Wrap lambda in an API-Gateway integration
    const callbackIntegration = new apigateway.LambdaIntegration(callbackHandler, {
      requestTemplates: { "application/json": "{ \"statusCode\": 200 }" },
    });

    // Define the `sender` lambda (sending end), and pass the relevant params.
    const senderHandler = new lambda.NodejsFunction(this, 'twilio-sender', {
      entry: 'functions/twilio-sender/twilio-sender.ts',
      handler: 'twilioHandler',
      environment: {
        TWILIO_ACCOUNT_SID: twilioSecret.secretValueFromJson('TWILIO_ACCOUNT_SID').toString(),
        TWILIO_AUTH_TOKEN: twilioSecret.secretValueFromJson('TWILIO_AUTH_TOKEN').toString(),
        TWILIO_MESSAGE_SERVICE_SID: twilioSecret.secretValueFromJson('TWILIO_MESSAGE_SERVICE_SID').toString(),
      }
    });

    // Wrap lambda in an API-Gateway integration
    const senderIntegration = new apigateway.LambdaIntegration(senderHandler);

    // Give permission to the sender Lambda to access only the Twilio callback url
    senderHandler.role?.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [`arn:aws:ssm:eu-central-1:${stageVariables.accountId}:parameter/${ssmParameterName}`],
      effect: iam.Effect.ALLOW,
      actions: ['ssm:GetParameter']
    }));

    // Give permission to the callback handler to access Dynamo for the updates
    callbackHandler.role?.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [`arn:aws:dynamodb:eu-central-1:${stageVariables.accountId}:table/CampaignDeliveries`],
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:UpdateItem']
    }));

    // Define a dead-letter-queue for the SMS
    const dlq = new sqs.Queue(this, 'Twilio_SMS_DLQ', {
      queueName: `twilioSmsDLQ_${stage}`,
      retentionPeriod: core.Duration.days(14),
    });

    // SNS Subscription for sending an SMS
    const snsTopic = new sns.Topic(this, 'Twilio_SMS_Topic', {
      displayName: 'Twilio SMS Topic',
      topicName: `twilioSMS_${stage}`,
    });

    // Define a subscription wrapper for the sender
    const senderLambdaSubscription = new snsSubs.LambdaSubscription(senderHandler, {
      deadLetterQueue: dlq,
    });

    snsTopic.addSubscription(senderLambdaSubscription);

    // Finally, connect the gateway to the lambda-integrations
    postApi.root.addMethod('GET', senderIntegration);
    postApi.root.addMethod('POST', callbackIntegration);

    // TODO: Is this URL deterministic? Or is it changed with every
    // deployment? If so, need to consider what happens to existing
    // deliveries if URL changes
    this.url = postApi.url;
  }
}