import { logger } from '../../config/logger';
import AWS from '../../config/aws';
import { S3FileService } from '../Common/File/S3FileService';
import { AWSServiceMap } from '../Common/Mappings/AWSServiceMap';

export interface ReportLambdaInput {
  API_URL: string;
  DASHBOARD_URL: string;
  AUTHENTICATE_EMAIL: string;
  WORKSPACE_EMAIL: string;
  REPORT_URL: string;
  WORKSPACE_SLUG: string;
  USER_ID: string;
  AUTOMATION_ACTION_ID: string;
}

export class ReportService {
  lambda: AWS.Lambda;
  sts: AWS.STS;
  sns: AWS.SNS;
  s3FileService: S3FileService;
  private serviceMap: AWSServiceMap;

  constructor() {
    this.lambda = new AWS.Lambda();
    this.sts = new AWS.STS();
    this.sns = new AWS.SNS();
    this.s3FileService = new S3FileService(new AWS.S3());
    this.serviceMap = new AWSServiceMap(process.env.AWS_ACCOUNT_ID as string, new AWS.Config());
  }

  /**
   * Calls the 'GenerateReport' SNS which triggers the corresponding lambda which generate a report
   * @param payload the input necessary for the generate report lambda to run
   */
  public async dispatchJob (payload: ReportLambdaInput) {
    const stringifiedPayload = JSON.stringify(payload);
    const snsParams: AWS.SNS.PublishInput = {
      Message: stringifiedPayload,
      TopicArn: this.serviceMap.getSNSResource(this.serviceMap.Report_SNS_PubTopic),
    }

    logger.debug(`payload for generating report: ${stringifiedPayload}`);

    return this.sns.publish(snsParams, (err, data) => {
      if (err) return logger.error('Error in Publishing', err);
      logger.log(`Deployed haas-api-report: ${data}`);
    }).promise();
  }
}

export const reportService = new ReportService();
