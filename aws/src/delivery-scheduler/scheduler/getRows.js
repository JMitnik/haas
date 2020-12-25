const AWS = require('aws-sdk');

const dbClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
});

const res = dbClient.query({
  TableName: 'CampaignDeliveries',
  KeyConditionExpression: 'DeliveryDate = :date',
  ExpressionAttributeValues: {
    ':date': '25122020',
  },
}).promise();

res.then((data) => {
  console.log(data);
});
