import { lambdaHandler, DeliveryItem } from '../campaign-deliveries-schedule-handler/campaign-deliveries-schedule-handler';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';

test('test', async () => {
  AWSMock.setSDKInstance(AWS);

  AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: any, callback: Function) => {
    let items: DeliveryItem[] = [{
      DeliveryDate: '01012020',
      DeliveryDate_DeliveryID: '01012020'
    }]
    callback(null, { Items: items });
  });

  AWSMock.mock('DynamoDB.DocumentClient', 'update', (params: any, callback: Function) => {
    callback(null);
  });

  await lambdaHandler();
  AWSMock.restore('DynamoDB.DocumentClient');
});