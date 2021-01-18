import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as papaparse from 'papaparse';
import archiver from 'archiver';
import fetch from 'node-fetch';

import config from '../../config/config';
import prisma from '../../config/prisma';
import { NexusGenInputs } from '../../generated/nexus';
import { FindManyTriggerArgs } from '@prisma/client';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';

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

  static paginatedAutodeckJobs = async (
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const findManyTriggerArgs: FindManyTriggerArgs = {
      where: {
        id: {
          not: undefined
        }
      },
    };

    const findManyTriggers = async (
      { props: findManyArgs }: FindManyCallBackProps,
    ) => prisma.createWorkspaceJob.findMany(findManyArgs);
  
    const countTriggers = async ({ props: countArgs }: FindManyCallBackProps) => prisma.createWorkspaceJob.count(countArgs);

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: findManyTriggerArgs,
        searchFields: ['name'],
        orderFields: ['medium', 'type', 'name'],
        findManyCallBack: findManyTriggers,
      },
      countArgs: {
        countWhereInput: findManyTriggerArgs,
        countCallBack: countTriggers,
      },
      paginationOpts,
    };

    return paginate(paginateProps);
  };

  static createJob = async (input: InputProps) => {
    const job = await prisma.job.create({
      data: {
        type: 'CREATE_WORKSPACE_JOB',
        createWorkspaceJob: {
          create: {
            referenceType: 'AWS',
            status: 'PENDING',
          },
        },
      },
      include: {
        createWorkspaceJob: true,
      },
    });

    const csvInput = { ...input, jobId: job.id };
    const csv = papaparse.unparse([csvInput]);
    const date = new Date();
    const tempDir = `/tmp/autodeck-${date.getTime()}/`;
    fs.mkdirSync(tempDir);
    fs.writeFileSync(`${tempDir}input.csv`, csv);

    await AutodeckService.fetchImage(input.logo, `${tempDir}logo.jpg`);
    await AutodeckService.zipDirectory(tempDir, `/home/daan/Desktop/autodeck-input-${date.getTime()}.zip`);

    if (fs.existsSync(`/home/daan/Desktop/autodeck-input-${date.getTime()}.zip`)) {
      await AutodeckService.uploadFileToS3('haas-autodeck-input', `${input.name}.zip`, `/home/daan/Desktop/autodeck-input-${date.getTime()}.zip`);
      return job;
    }
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
      ContentType: 'application/zip',
    }).promise();
  };
}

export default AutodeckService;
