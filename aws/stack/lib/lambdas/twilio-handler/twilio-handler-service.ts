import * as core from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as iam from '@aws-cdk/aws-iam';

interface TwilioHanderServiceProps {
    accountId: string;
}

export class TwilioHandlerService extends core.Construct {
    url: string;

    constructor(scope: core.Construct, id: string, props: TwilioHanderServiceProps) {
        super(scope, id);
        const postApi = new apigateway.RestApi(this, 'handle-twilio-api');

        const ssmVal = new ssm.StringParameter(this, 'API_URL', {
            stringValue: postApi.url,
            parameterName: 'TWILIO_CALLBACK_URL',
        });

        console.log(props.accountId);

        const twilioSecret = secretsmanager.Secret.fromSecretNameV2(this, 'Twilio_SECRET', 'TWILIO_PROD');

        const callbackHandler = new lambda.NodejsFunction(this, 'twilio-handler', {
            entry: 'lib/lambdas/twilio-handler/twilio-handler.ts',
            handler: 'main',
        });

        const senderHandler = new lambda.NodejsFunction(this, 'twilio-sender', {
            entry: 'lib/lambdas/twilio-handler/twilio-sender.ts',
            handler: 'main',
            environment: {
                TWILIO_ACCOUNT_SID: twilioSecret.secretValueFromJson('TWILIO_ACCOUNT_SID').toString(),
                TWILIO_AUTH_TOKEN: twilioSecret.secretValueFromJson('TWILIO_AUTH_TOKEN').toString(),
                TWILIO_MESSAGE_SERVICE_SID: twilioSecret.secretValueFromJson('TWILIO_MESSAGE_SERVICE_SID').toString(),
            }
        });

        senderHandler.role?.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [`arn:aws:ssm:eu-central-1:${props.accountId}:parameter/TWILIO_CALLBACK_URL`],
            effect: iam.Effect.ALLOW,
            actions: ['ssm:GetParameter']
        }))

        const callbackIntegration = new apigateway.LambdaIntegration(callbackHandler, {
            requestTemplates: { "application/json": "{ \"statusCode\": 200 }" },
        });

        const senderIntegration = new apigateway.LambdaIntegration(senderHandler);

        postApi.root.addMethod('GET', senderIntegration);
        postApi.root.addMethod('POST', callbackIntegration);

        // TODO: Is this URL deterministic? Or is it changed with every
        // deployment? If so, need to consider what happens to existing
        // deliveries if URL changes
        this.url = postApi.url;
    }
}