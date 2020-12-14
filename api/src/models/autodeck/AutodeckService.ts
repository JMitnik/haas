import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as papaparse from 'papaparse';
import config from '../../config/config';

const s3 = new AWS.S3({ accessKeyId: config.awsAccessKeyId, secretAccessKey: config.awsSecretAccessKey });

interface InputProps {
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  firstName: string;
  logo: string;
  name: string;
  primaryColour: string;
  website: string;
}
class AutodeckService {
  static createJob = async (input: InputProps) => {
    const csv = papaparse.unparse([input]);
    fs.writeFileSync('/tmp/test.csv', csv);
    const resultPath = await AutodeckService.uploadDataToS3('haas-autodeck-input', 'test.csv', csv);
    return resultPath;
  };

  static uploadDataToS3 = (bucket: string, fileKey: string, data: string) => {
    console.log('uploading: ', bucket, fileKey, data);
    return s3.upload({
      Bucket: bucket,
      Key: fileKey,
      Body: data,
      ACL: 'private',
      ContentType: 'text/csv',
    }).promise();
  };

  static uploadFileToS3 = (bucket: string, fileKey: string, filePath: string) => {
    console.log('uploading: ', bucket, fileKey, filePath);
    return s3.upload({
      Bucket: bucket,
      Key: fileKey,
      Body: fs.createReadStream(filePath),
      ACL: 'private',
      ContentType: 'text/csv',
    }).promise();
  };
}

export default AutodeckService;
