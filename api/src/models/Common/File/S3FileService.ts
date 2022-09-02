import { S3 } from 'aws-sdk'

import { FetchOptions } from './S3FileService.types';

export class S3FileService {
  s3Client: S3;

  constructor(s3Client: S3) {
    this.s3Client = s3Client;
  }

  public async fetchUrl(options: FetchOptions) {
    if (options.presigned) {
      return this.fetchSignedUrl(options);
    }

    return `https://${options.bucketName}.s3${this.s3Client.config.region}.amazonaws.com/${options.objectKey}`;
  }

  private fetchSignedUrl(options: FetchOptions) {
    return this.s3Client.getSignedUrlPromise('getObject', {
      Bucket: options.bucketName,
      Key: options.objectKey,
      Expires: 60 * (options.expirationInSec || 5),
    });
  }
}