import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as papaparse from 'papaparse';
import { StringStream } from 'scramjet';
import archiver from 'archiver';
import fetch from 'node-fetch';
import request from 'request';

import config from '../../config/config';
import prisma from '../../config/prisma';
import { NexusGenInputs } from '../../generated/nexus';
import { FindManyTriggerArgs } from '@prisma/client';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';


type ScreenshotProps = {
  websiteUrl: string;
  bucket: string;
  jobId: string;
  requiresRembg: boolean | null | undefined;
  requiresScreenshot: boolean | null | undefined;
  requiresColorExtraction: boolean | null | undefined;
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

export interface CreateWorkspaceJobProps {
  id?: string | null;
  name?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  answer1?: string | null;
  answer2?: string | null;
  answer3?: string | null;
  answer4?: string | null;
  firstName?: string | null;
  primaryColour?: string | null;
  requiresRembg?: boolean | null;
  requiresWebsiteScreenshot?: boolean | null;
  requiresColorExtraction?: boolean | null;
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

  static confirmWorkspaceJob = async (input: CreateWorkspaceJobProps) => {
    // // TODO: Check if workspace job exist. If not => 
    // const workspaceJob = await prisma.createWorkspaceJob.findOne({
    //   where: {
    //     id: input.id || '',
    //   }
    // })

    // if (!workspaceJob) {
    const csvData = { 'colour-0': input.primaryColour };
    const csv = papaparse.unparse([csvData]);
    const csvPath = `${input.id}/dominant_colours.csv`;
    await AutodeckService.uploadDataToS3('haas-autodeck-logos', csvPath, csv, 'text/csv')
    // }

    const updatedWorkspaceJob = await prisma.createWorkspaceJob.upsert({
      where: {
        id: input.id || '-1',
      },
      create: {
        id: input.id || '',
        name: input.name || '',
        status: 'IN_PHOTOSHOP_QUEUE',
        referenceType: 'AWS',
        requiresColorExtraction: false,
        requiresRembg: false,
        requiresScreenshot: false
      },
      update: {
        status: 'IN_PHOTOSHOP_QUEUE',
      }
    })

    return updatedWorkspaceJob;
  }

  static createWorkspaceJob = async (input: CreateWorkspaceJobProps) => {
    const workspaceJob = await prisma.createWorkspaceJob.create({
      data: {
        id: input.id || '',
        name: input.name,
        status: 'PRE_PROCESSING',
        referenceType: 'AWS',
        requiresRembg: input.requiresRembg || false,
        requiresScreenshot: input.requiresWebsiteScreenshot || false,
        requiresColorExtraction: input.requiresColorExtraction || false,
      }
    })

    if (!input.requiresColorExtraction) {
      const csvData = { 'colour-0': input.primaryColour };
      const csv = papaparse.unparse([csvData]);
      const csvPath = `${input.id}/dominant_colours.csv`;
      await AutodeckService.uploadDataToS3('haas-autodeck-logos', csvPath, csv, 'text/csv')
    }

    if (input.requiresRembg || input.requiresColorExtraction) {
      console.log('going to run lamba for logo manipulation');
      const fileKey = input?.logoUrl?.split('.com/')[1]
      const logoManipulationEvent = {
        key: fileKey,
        bucket: 'haas-autodeck-logos',
        requiresRembg: input.requiresRembg,
        requiresScreenshot: input.requiresWebsiteScreenshot,
        requiresColorExtraction: input.requiresColorExtraction
      }
      const strLogoManipulationEvent = JSON.stringify(logoManipulationEvent, null, 2);
      const logoManipulationSNSParams = {
        Message: strLogoManipulationEvent,
        TopicArn: "arn:aws:sns:eu-central-1:118627563984:SalesDeckProcessingChannel"
      }
      sns.publish(logoManipulationSNSParams, (err, data) => {
        if (err) console.log('ERROR: ', err);

        console.log('Logo manipulation publish response: ', data);
      });
    }

    if (input.requiresWebsiteScreenshot) {
      console.log('going to run lamba for website screenshot');
      const screenshotEvent: ScreenshotProps = {
        websiteUrl: input.websiteUrl || '',
        bucket: 'haas-autodeck-logos',
        jobId: input.id || '',
        requiresRembg: input.requiresRembg,
        requiresScreenshot: input.requiresWebsiteScreenshot,
        requiresColorExtraction: input.requiresColorExtraction
      }
      const strScreenshotEvent = JSON.stringify(screenshotEvent, null, 2);
      const screenshotSNSParams = {
        Message: strScreenshotEvent,
        TopicArn: "arn:aws:sns:eu-central-1:118627563984:WebsiteScreenshotChannel"
      };
      sns.publish(screenshotSNSParams, (err, data) => {
        if (err) console.log('ERROR: ', err);

        console.log('Website screenshot publish response: ', data);
      });
    }

    return workspaceJob;
  }

  static getPreviewData = async (id: string) => {
    // Download colour CSV from S3
    const S3_BUCKET_PREFIX = `https://haas-autodeck-logos.s3.eu-central-1.amazonaws.com/${id}`;

    const params = {
      Bucket: 'haas-autodeck-logos',
      Prefix: `${id}/`
    };

    const logoKey = await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) return reject(err);
        const fileWithRembg = data.Contents?.find((file) => file.Key?.includes('rembg'))
        if (!fileWithRembg) {
          const originalFile = data.Contents?.find((file) => file.Key?.includes('original'))
          const fileName = originalFile?.Key?.split('/')[1];
          resolve(fileName)
        }
        const fileName = fileWithRembg?.Key?.split('/')[1];
        resolve(fileName);
      });
    });

    const rembgLogoUrl = `${S3_BUCKET_PREFIX}/${logoKey}`;

    const screenshotKey = await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) return reject(err);
        const file = data.Contents?.find((file) => file.Key?.includes('website_screenshot'))
        const fileName = file?.Key?.split('/')[1];
        resolve(fileName);
      });
    });

    const websiteScreenshotUrl = screenshotKey ? `${S3_BUCKET_PREFIX}/${screenshotKey}` : '';
    const csvUrl = `${S3_BUCKET_PREFIX}/dominant_colours.csv`;

    const dominantColorsCSV = await request(csvUrl)
      .pipe(new StringStream())                       // pass to stream
      .CSVParse({ delimiter: ',' })
      .toArray()
      .catch((err) => {
        console.log('Something went wrong retrieving dominant colors CSV: ', err)
        return [];
      })

    const colorPalette = dominantColorsCSV.length > 0 ? dominantColorsCSV[1] : [];
    const result: { colors: Array<string>, rembgLogoUrl: string, websiteScreenshotUrl: string }
      = { colors: colorPalette, rembgLogoUrl, websiteScreenshotUrl };
    return result;
  }

  static downloadFileFromS3 = async (bucket: string, fileKey: string, filePath: string) => {
    'use strict';
    return new Promise(function (resolve, reject) {
      const file = fs.createWriteStream(filePath),
        stream = s3.getObject({
          Bucket: bucket,
          Key: fileKey
        }).createReadStream();
      stream.on('error', reject);
      file.on('error', reject);
      file.on('finish', function () {
        resolve(filePath);
      });
      stream.pipe(file);
    });
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
