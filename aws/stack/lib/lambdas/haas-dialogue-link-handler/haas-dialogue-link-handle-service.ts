import {
  Duration,
  aws_sqs as sqs,
  aws_lambda_nodejs,
  aws_ssm as ssm,
} from 'aws-cdk-lib'
import { Construct } from "constructs";
import { SqsDestination } from 'aws-cdk-lib/aws-lambda-destinations';

const name = 'HAAS_DIALOGUE_LINK_HANDLE';

interface HaasDialogueLinkHandleServiceProps {
  AUTOMATION_API_KEY: string;
}

export class HaasDialogueLinkHandleService extends Construct {

  constructor(scope: Construct, id: string, props: HaasDialogueLinkHandleServiceProps) {
    super(scope, id);

    // Define a dead-letter-queue
    const dlqLambda = new sqs.Queue(this, `${name}_LAMBDA_DLQ`, {
      queueName: `${name}_DLQ_LAMBDA`,
      retentionPeriod: Duration.days(14),
    });

    // Define the `sender` lambda (sending end), and pass the relevant params.
    const haasDialogueLinkSenderLambda = new aws_lambda_nodejs.NodejsFunction(this, `${name}-sender`, {
      entry: 'lib/lambdas/haas-dialogue-link-handler/haas-dialogue-link-sender.ts',
      handler: 'main',
      timeout: Duration.seconds(60),
      onFailure: new SqsDestination(dlqLambda),
      deadLetterQueue: dlqLambda,
      environment: {
        AUTOMATION_API_KEY: props.AUTOMATION_API_KEY,
      }
    });

    const dialogueLinkLambdaArnParam = new ssm.StringParameter(this, 'dialogue-link-lambda-arn', {
      parameterName: 'DialogueLinkLambdaArn',
      stringValue: haasDialogueLinkSenderLambda.functionArn,
      description: 'the arn of the lambda used to send dialogue links to the correct people',
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });

  }
}
