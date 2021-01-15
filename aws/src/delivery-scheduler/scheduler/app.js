const AWS = require('aws-sdk');
const format = require('date-fns/format');

const dbClient = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.AWS_SAM_LOCAL ? 'http://host.docker.internal:8000' : undefined,
});

const TABLE_NAME = 'CampaignDeliveries';

exports.lambdaHandler = async () => {
  try {
    const now = Date.now();
    const date = format(now, 'ddMMyyyy');

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'DeliveryDate = :date AND DeliveryDate_DeliveryID < :now',
      FilterExpression: 'DeliveryStatus = :deployedStatus',
      ExpressionAttributeValues: {
        ':deployedStatus': 'SCHEDULED',
        ':date': `${date}`,
        ':now': `${new Date(now).toISOString()}`,
      },
    };

    const queryDB = dbClient.query(params, ((err, data) => {
      if (err) {
        console.error(`An error: ${err}`);
      } else {
        console.log(`Fetched ${(data.Items || []).length} items!`);
      }
    })).promise();

    const results = await queryDB;

    if (results && results.Items && results.Items.length) {
      const updates = results.Items.map((item) => dbClient.update({
        TableName: TABLE_NAME,
        Key: {
          DeliveryDate: item.DeliveryDate,
          DeliveryDate_DeliveryID: item.DeliveryDate_DeliveryID,
        },
        UpdateExpression: 'set DeliveryStatus = :status',
        ExpressionAttributeValues: {
          ':status': 'DEPLOYED',
        },
      }).promise());

      const updated = await Promise.all(updates);

      console.log(updated, 'is updated');
    }

    return queryDB;
  } catch (err) {
    console.log(err);
    return err;
  }
};
