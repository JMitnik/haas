import {
  Duration,
  aws_sqs as sqs,
  aws_lambda_nodejs,
  aws_lambda,
  aws_ssm as ssm,
  aws_cloudwatch as cloudwatch
} from 'aws-cdk-lib'
import { Construct } from "constructs";
import { SqsDestination } from 'aws-cdk-lib/aws-lambda-destinations';
import { BaseLambdaService } from '../../../constructs/Base/BaseLambdaService';

const name = 'StaleRequestReminder';

interface StaleRequestReminderServiceProps {
  AUTOMATION_API_KEY: string;
}

export class StaleRequestReminderService extends BaseLambdaService {

  constructor(scope: Construct, id: string, props: StaleRequestReminderServiceProps) {
    super(scope, id, { ...props, name });

    // Define a dead-letter-queue
    const dlqLambda = new sqs.Queue(this, `${name}_Lambda_DLQ`, {
      queueName: `${name}_Lambda_DLQ`,
      retentionPeriod: Duration.days(14),
    });

    const lambda = new aws_lambda_nodejs.NodejsFunction(this, `${name}_Lambda`, {
      entry: 'lib/stacks/Automations/StaleRequestReminder/StaleRequestReminderLambda.ts',
      handler: 'main',
      timeout: Duration.seconds(60),
      onFailure: new SqsDestination(dlqLambda),
      deadLetterQueue: dlqLambda,
      tracing: aws_lambda.Tracing.ACTIVE,
      environment: {
        AUTOMATION_API_KEY: props.AUTOMATION_API_KEY,
      }
    });

    this.addErrorLogging(lambda);
    this.addDLQ(lambda);
    this.addSQS('staleRequestReminder', lambda);

    // Store the ARN of the Lambda which sends links to people.
    this.saveLambdaARN(lambda.functionArn);
  }

  /**
   * Stores the Lambda ARN in AWS's parameter store
   * @param lambdaArn
   */
  private saveLambdaARN(lambdaArn: string) {
    new ssm.StringParameter(this, 'dialogue-link-lambda-arn', {
      // TODO: Ensure the API does not fetch this in deployment
      parameterName: `${name}_Arn`,
      stringValue: lambdaArn,
      description: 'The ARN of the lambda used to send dialogue links to the correct people',
      type: ssm.ParameterType.STRING,
      tier: ssm.ParameterTier.STANDARD,
      allowedPattern: '.*',
    });
  }
}
