export interface FetchOptions {
  bucketName: string;
  objectKey: string;
  expirationInSec?: number;
  presigned?: boolean;
}