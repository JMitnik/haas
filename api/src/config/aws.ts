import AWS from 'aws-sdk';
import config from './config';

try {
  AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  });
} catch (e) {
}
export default AWS;
