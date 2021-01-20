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


type ScreenshotProps = {
  websiteUrl: string;
  bucket: string;
  jobId: string;
};

const s3 = new AWS.S3({ accessKeyId: config.awsAccessKeyId, secretAccessKey: config.awsSecretAccessKey, region: 'eu-central-1' });
const sns = new AWS.SNS({
  region: 'eu-central-1',
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey
});

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

interface CreateWorkspaceJobProps {
  id?: string | null;
  name?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
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

  static createWorkspaceJob = async (input: CreateWorkspaceJobProps) => {
    const workspaceJob = await prisma.createWorkspaceJob.create({
      data: {
        id: input.id || '',
        name: input.name,
        status: 'PRE_PROCESSING',
        referenceType: 'AWS',
      }
    })

    // const fileKey = input?.logoUrl?.split('.com/')[1]
    // const logoManipulationEvent = {
    //   s3: {
    //     object: {
    //       key: fileKey
    //     },
    //     bucket: {
    //       name: 'haas-autodeck-logos'
    //     }
    //   }
    // }
    // const strLogoManipulationEvent = JSON.stringify(logoManipulationEvent, null, 2);
    // const logoManipulationSNSParams = {
    //   Message: strLogoManipulationEvent,
    //   TopicArn: "arn:aws:sns:eu-central-1:118627563984:SalesDeckProcessingChannel"
    // }
    // sns.publish(logoManipulationSNSParams, (err, data) => {
    //   if (err) console.log('ERROR: ', err);

    //   console.log('Logo manipulation publish response: ', data);
    // });
   
    // const screenshotEvent: ScreenshotProps = {
    //   websiteUrl: input.websiteUrl || '',
    //   bucket: 'haas-autodeck-logos',
    //   jobId: input.id || ''
    // }
    // const strScreenshotEvent = JSON.stringify(screenshotEvent, null, 2);
    // const screenshotSNSParams = {
    //   Message: strScreenshotEvent,
    //   TopicArn: "arn:aws:sns:eu-central-1:118627563984:WebsiteScreenshotChannel"
    // };
    // sns.publish(screenshotSNSParams, (err, data) => {
    //   if (err) console.log('ERROR: ', err);

    //   console.log('Website screenshot publish response: ', data);
    // });

    return workspaceJob;
  }

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

  static uploadDataToS3 = (bucket: string, fileKey: string, data: string, mimeType: string) => {
    return s3.upload({
      Bucket: bucket,
      Key: fileKey,
      Body: data,
      ACL: 'private',
      ContentType: mimeType,
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
