import AWS from 'aws-sdk';
import config from './config';

try {
  AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  });
} catch (e) {
  console.log('Unable to set AWS, wont use AWS services');
}

export default AWS;
