import AWS from '../../config/aws';

export interface ReportLambdaInput {
  API_URL: string;
  DASHBOARD_URL: string;
  AUTHENTICATE_EMAIL: string;
  WORKSPACE_EMAIL: string;
  REPORT_URL: string;
}

class ReportService {
  lambda: AWS.Lambda;
  sts: AWS.STS;
  sns: AWS.SNS;

  constructor() {
    this.lambda = new AWS.Lambda();
    this.sts = new AWS.STS();
    this.sns = new AWS.SNS();
  }

  /**
   * Calls the 'GenerateReport' SNS which triggers the corresponding lambda which generate a report
   * @param payload the input necessary for the generate report lambda to run
   */
  generateReport = async (payload: ReportLambdaInput) => {
    const stringifiedPayload = JSON.stringify(payload);
    const snsParams: AWS.SNS.PublishInput = {
      Message: stringifiedPayload,
      // TODO: Track this as dependency
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:haasApiReport",
    }

    this.sns.publish(snsParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
      console.log('Succesfully published to SNS:', data);
    });

  }
}

export const reportService = new ReportService();
