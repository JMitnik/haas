import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as papaparse from 'papaparse';
import archiver from 'archiver';
import fetch from 'node-fetch';

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
    const date = new Date();
    const tempDir = `/tmp/autodeck-${date.getTime()}/`;
    fs.mkdirSync(tempDir);
    fs.writeFileSync(`${tempDir}input.csv`, csv);
    await AutodeckService.fetchImage(input.logo, `${tempDir}logo.jpg`);
    await AutodeckService.zipDirectory(tempDir, '/home/daan/Desktop/autodeck_input.zip');
    // const resultPath = await AutodeckService.uploadDataToS3('haas-autodeck-input', 'test.csv', csv);
    // return resultPath;
  };

  /**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
  static zipDirectory = (source: string, out: string) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', (err) => reject(err))
        .pipe(stream);
      stream.on('close', () => resolve());
      archive.finalize();
    });
  };

  static fetchImage = async (url: string, destinationPath: string) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(destinationPath, buffer);
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
