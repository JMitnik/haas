const AWS = require('aws-sdk');

const dbClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
});

dbClient.put({
  TableName: 'CampaignDeliveries',
  Item: {
    DeliveryDate: '25122020',
    DeliveryDate_DeliveryID: `${new Date().toISOString()}-${Math.random()}`,
  },
}).promise().then('Done');
