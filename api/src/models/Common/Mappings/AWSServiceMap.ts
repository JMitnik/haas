import AWSSDK from '../../../config/aws';

export class AWSServiceMap {
  public accountId: string;

  private awsConfig: AWSSDK.Config;
  private ssm: AWSSDK.SSM;

  // AWS service constants, which follow the NAMING scheme: `Namespace_Service_Description`.
  public Report_SNS_PubTopic: string = 'haasApiReport'
  public Report_Eventbridge_DLQName: string = 'ReportCrawler_EventBridge_DLQ';

  public DialogueSender_SNS_PubTopic: string = 'dialogueLinkSender';
  public StaleRequestReminder_SNS_PubTopic: string = 'staleRequestReminder';

  constructor(accountId: string, awsConfig: AWSSDK.Config) {
    this.accountId = accountId;
    this.awsConfig = awsConfig;

    this.ssm = new AWSSDK.SSM();
  }

  /** Fetches SNS resource */
  public getSNSResource(resource: string) {
    return `arn:aws:sns:eu-central-1:${this.accountId}:${resource}`;
  }

  /** Fetches SQS resource */
  public getSQSResource(resource: string) {
    return `arn:aws:sqs:eu-central-1:${this.accountId}:${resource}`;
  }

  /**
   * Fetches parameter from SSM store.
   */
  public async getParameter(parameterName: string) {
    const param = await this.ssm.getParameter({ Name: parameterName }).promise();

    return param.Parameter?.Value;
  };
}
