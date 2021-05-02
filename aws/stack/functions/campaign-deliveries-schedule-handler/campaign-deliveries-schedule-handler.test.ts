import { lambdaHandler } from '../campaign-deliveries-schedule-handler/campaign-deliveries-schedule-handler';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';

test('test', async () => {
  AWSMock.setSDKInstance(AWS);

  AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: any, callback: Function) => {
    console.log('I queried!');
    callback(null, { Items: [] });
  });
  AWSMock.mock('DynamoDB.DocumentClient', 'update', (params: any, callback: Function) => {
    console.log('I queried!');
    callback(null);
  });

  await lambdaHandler();
  AWSMock.restore('DynamoDB.DocumentClient');
});