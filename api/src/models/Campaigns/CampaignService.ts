import { addDays } from 'date-fns';
import { uniqueId } from 'lodash';
import AWS from '../../config/aws';

export class CampaignService {
  static createCampaign() {
    const client = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: 'CampaignJobs',
      Item: {
        CampaignJobId: uniqueId(),
        timestamp: addDays(Date.now(), 10).toUTCString(),
      },
    };

    client.put(params, (err, data) => {
      if (err) {
        console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
      } else {
        console.log('Query succeeded.');
        console.log(data);
      }
    });
  }
}

export const campaignService = new CampaignService();
