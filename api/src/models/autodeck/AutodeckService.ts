import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as papaparse from 'papaparse';
import { StringStream } from 'scramjet';
import archiver from 'archiver';
import fetch from 'node-fetch';
import request from 'request';

import config from '../../config/config';
import { NexusGenInputs } from '../../generated/nexus';
import { CustomField, FindManyCreateWorkspaceJobArgs, JobProcessLocation, PrismaClient, PrismaClientOptions } from '@prisma/client';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import CustomerService from '../customer/CustomerService';
import { CustomerServiceType } from '../customer/CustomerServiceType';
import { AutodeckServiceType } from './AutodeckServiceType';
import { JobProcessLocationPrismaAdapterType } from './JobProcessLocationPrismaAdapterType';
import JobProcessLocationPrismaAdapter from './JobProcessLocationPrismaAdapter';
import { CreateWorkspaceJobPrismaAdapterType } from './CreateWorkspaceJobPrismaAdapterType';
import CreateWorkspaceJobPrismaAdapter from './CreateWorkspaceJobPrismaAdapter';
import { CustomFieldPrismaAdapterType } from './CustomFieldPrismaAdapterType';
import CustomFieldPrismaAdapter from './CustomFieldPrismaAdapter';


type ScreenshotProps = {
  websiteUrl: string;
  bucket: string;
  jobId: string;
  requiresRembg: boolean | null | undefined;
  requiresScreenshot: boolean | null | undefined;
  requiresColorExtraction: boolean | null | undefined;
};

const s3 = new AWS.S3({
  accessKeyId: config.autodeckAwsAccessKeyId,
  secretAccessKey: config.autodeckAwsSecretAccessKey,
  region: 'eu-central-1'
});
const sns = new AWS.SNS({
  region: 'eu-central-1',
  accessKeyId: config.autodeckAwsAccessKeyId,
  secretAccessKey: config.autodeckAwsSecretAccessKey
});

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
  usesAdjustedLogo?: boolean | null;
  jobLocationId?: string | null;
}

class AutodeckService implements AutodeckServiceType {
  customFieldPrismaAdapter: CustomFieldPrismaAdapterType;
  customerService: CustomerServiceType;
  jobProcessLocationPrismaAdapter: JobProcessLocationPrismaAdapterType;
  createWorkspaceJobPrismaAdapter: CreateWorkspaceJobPrismaAdapterType;

  constructor(prismaClient: PrismaClient<PrismaClientOptions, never>) {
    this.customerService = new CustomerService(prismaClient);
    this.jobProcessLocationPrismaAdapter = new JobProcessLocationPrismaAdapter(prismaClient);
    this.createWorkspaceJobPrismaAdapter = new CreateWorkspaceJobPrismaAdapter(prismaClient);
    this.customFieldPrismaAdapter = new CustomFieldPrismaAdapter(prismaClient)
  }

  update(input: { id: string; resourceUrl: string | null | undefined; status: "PRE_PROCESSING" | "PRE_PROCESSING_LOGO" | "PRE_PROCESSING_WEBSITE_SCREENSHOT" | "READY_FOR_PROCESSING" | "IN_PHOTOSHOP_QUEUE" | "PHOTOSHOP_PROCESSING" | "PROCESSING" | "WRAPPING_UP" | "PENDING" | "COMPLETED" | "FAILED" | "TRANSFORMING_PSDS_TO_PNGS" | "STITCHING_SLIDES" | "COMPRESSING_SALES_MATERIAL"; errorMessage: string | undefined; }) {
    return this.createWorkspaceJobPrismaAdapter.update(input.id, {
      resourcesUrl: input.resourceUrl,
      status: input.status,
      errorMessage: input.errorMessage
    });
  }

  getJobById(jobId: string) {
    return this.createWorkspaceJobPrismaAdapter.findOne({
      where: {
        id: jobId,
      },
    });
  }

  getJobProcessLocationOfJob(createWorkspaceJobId: string): Promise<JobProcessLocation> {
    return this.jobProcessLocationPrismaAdapter.findFirst({
      where: {
        job: {
          some: {
            id: createWorkspaceJobId,
          },
        },
      },
    });
  }

  getCustomFieldsOfJobProcessLocation(jobProcessLocationId: string): Promise<CustomField[]> {
    return this.customFieldPrismaAdapter.findMany({
      where: {
        jobProcessLocationId: jobProcessLocationId,
      }
    })
  }

  getJobProcessLocations = async () => {
    return this.jobProcessLocationPrismaAdapter.findAll();
  }

  createJobProcessLocation = async (input: any) => {
    const data = { name: input.name, path: input.path, type: input.type };
    return this.jobProcessLocationPrismaAdapter.create(data);
  }

  paginatedAutodeckJobs = async (
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const findManyTriggerArgs: FindManyCreateWorkspaceJobArgs = {
      where: {
        id: {
          not: undefined
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    };

    const findManyTriggers = async (
      { props: findManyArgs }: FindManyCallBackProps,
    ) => {
      return this.createWorkspaceJobPrismaAdapter.findMany(findManyArgs);
    };

    const countTriggers = async ({ props: countArgs }: FindManyCallBackProps) => this.createWorkspaceJobPrismaAdapter.count(countArgs);

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: findManyTriggerArgs,
        searchFields: ['name'],
        orderFields: ['updatedAt'],
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

  addNewCustomFieldsToTemplate = async (input: NexusGenInputs['GenerateAutodeckInput'], processLocationId: string) => {
    return this.jobProcessLocationPrismaAdapter.update(processLocationId, {
      fields: {
        create: input.newCustomFields?.map(({ key, value }) => ({ key: key || '', value: value || '' })) || [],
      }
    });
  }

  static generateKeyValuePair = (input: NexusGenInputs['GenerateAutodeckInput']) => {
    const mergedCustomFields = input.customFields?.concat(input?.newCustomFields || []).concat(input?.standardFields || []) || [];
    let mappedKeyValuePairs = {}
    mergedCustomFields.forEach(({ key, value }) => {
      if (key) Object.assign(mappedKeyValuePairs, { [key]: value })
    })

    return mappedKeyValuePairs
  }

  static usesAdjustedLogo = async (id: string) => {
    const params = {
      Bucket: 'haas-autodeck-logos',
      Prefix: `${id}/`
    };

    return await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) return reject(err);
        const fileWithAdjusted = data.Contents?.find((file) => file.Key?.includes('/adjusted'))
        if (!fileWithAdjusted) {
          resolve(false)
        }
        resolve(true);
      })
    });
  }


  retryJob = async (jobId: string) => {
    const updatedWorkspaceJob = await this.createWorkspaceJobPrismaAdapter.update(jobId, {
      status: 'IN_PHOTOSHOP_QUEUE'
    });

    const usesAdjustedLogo = await AutodeckService.usesAdjustedLogo(jobId);
    const photoshopInput = { jobId, usesAdjustedLogo, rootFolder: updatedWorkspaceJob?.processLocation?.path };
    const strEvent = JSON.stringify(photoshopInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      // TODO: Track this as dependency
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:PhotoshopChannel"
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });
    return updatedWorkspaceJob;
  }

  confirmWorkspaceJob = async (input: NexusGenInputs['GenerateAutodeckInput'], userId?: string) => {
    const csvData = { 'colour-0': input.primaryColour };
    const csv = papaparse.unparse([csvData]);
    const csvPath = `${input.id}/dominant_colours.csv`;
    await AutodeckService.uploadDataToS3('haas-autodeck-logos', csvPath, csv, 'text/csv')

    const updatedWorkspaceJob = await this.createWorkspaceJobPrismaAdapter.upsert(input.id, {
      id: input.id || '',
      name: input.name || '',
      status: 'IN_PHOTOSHOP_QUEUE',
      referenceType: 'AWS',
      requiresColorExtraction: false,
      requiresRembg: false,
      requiresScreenshot: false,
      processLocation: {
        connect: {
          id: input.jobLocationId || '-1',
        },
      }
    }, {
      status: 'IN_PHOTOSHOP_QUEUE',
    });

    const processLocationId = updatedWorkspaceJob.jobProcessLocationId
    await this.addNewCustomFieldsToTemplate(input, processLocationId)

    const mappedCustomFields = AutodeckService.generateKeyValuePair(input)

    const pitchdeckData: any = {
      ...mappedCustomFields,
      rootPath: updatedWorkspaceJob.processLocation.path,
    };


    const pitchdeckCSV = papaparse.unparse([pitchdeckData]);
    const pitchdeckCSVPath = `${input.id}/pitchdeck_input.csv`;
    await AutodeckService.uploadDataToS3('haas-autodeck-logos', pitchdeckCSVPath, pitchdeckCSV, 'text/csv')

    const photoshopInput = { jobId: updatedWorkspaceJob.id, usesAdjustedLogo: input.usesAdjustedLogo, rootFolder: updatedWorkspaceJob.processLocation.path }
    const strEvent = JSON.stringify(photoshopInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      // TODO: Track this as dependency
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:PhotoshopChannel"
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });

    if (input.isGenerateWorkspace) {
      try {
        if (!updatedWorkspaceJob.name || !input.primaryColour || !input.slug) throw 'No unsufficent input data to generate workspace'
        const workspaceInput: NexusGenInputs['CreateWorkspaceInput'] = {
          name: updatedWorkspaceJob.name,
          primaryColour: input.primaryColour,
          slug: input.slug,
          isSeed: true,
          logo: pitchdeckData?.uploadLogo,
          willGenerateFakeData: true
        }
        await this.customerService.createWorkspace(workspaceInput, userId)
      } catch (e) {
        console.log('Something went wrong: ', e)
      }
    }

    return updatedWorkspaceJob;
  }

  static getAdjustedLogo = async (adjusedLogoInput: NexusGenInputs['AdjustedImageInput']) => {
    const S3_BUCKET_PREFIX = `https://haas-autodeck-logos.s3.eu-central-1.amazonaws.com/${adjusedLogoInput.id}`;
    if (!adjusedLogoInput.bucket) return { url: 'not_found' };

    const params = {
      Bucket: adjusedLogoInput.bucket,
      Prefix: `${adjusedLogoInput.id}/`
    };

    const logoKey = await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) return reject(err);
        if (adjusedLogoInput.reset) {
          const fileWithRembg = data.Contents?.find((file) => file.Key?.includes('/rembg'))
          if (!fileWithRembg) {
            const originalFile = data.Contents?.find((file) => file.Key?.includes('/original'))
            const fileName = originalFile?.Key?.split('/')[1];
            resolve(fileName)
          }
          const fileName = fileWithRembg?.Key?.split('/')[1];
          resolve(fileName);
        }

        const adjustedFile = data.Contents?.find((file) => file.Key?.includes('adjusted'));
        if (!adjustedFile) {
          const fileWithRembg = data.Contents?.find((file) => file.Key?.includes('/rembg'))
          if (!fileWithRembg) {
            const originalFile = data.Contents?.find((file) => file.Key?.includes('/original'))
            const fileName = originalFile?.Key?.split('/')[1];
            resolve(fileName)
          }
          const fileName = fileWithRembg?.Key?.split('/')[1];
          resolve(fileName);
        }
        const adjustedFileName = adjustedFile?.Key?.split('/')[1];
        resolve(adjustedFileName);
      });
    });

    const adjustedLogoUrl = `${S3_BUCKET_PREFIX}/${logoKey}#${Date.now()}`;
    return { url: adjustedLogoUrl }
  }

  static whitifyImage = (whitifyImageInput: NexusGenInputs['AdjustedImageInput']) => {
    const strEvent = JSON.stringify(whitifyImageInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:WhitifyImageChannel"
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });
  }

  static resizeImage = (input: { bucket: string, key: string }) => {

    const strEvent = JSON.stringify(input, null, 2);
    const sNSParams = {
      Message: strEvent,
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:ResizeImageChannel"
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });
  }


  static removePixelRange = (removePixelRangeEventInput: NexusGenInputs['RemovePixelRangeInput']) => {

    const strEvent = JSON.stringify(removePixelRangeEventInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:PixalAdjustmentChannel"
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });
  }

  createWorkspaceJob = async (input: CreateWorkspaceJobProps) => {
    const workspaceJob = await this.createWorkspaceJobPrismaAdapter.create({
      id: input.id || '',
      name: input.name,
      status: 'PRE_PROCESSING',
      referenceType: 'AWS',
      requiresRembg: input.requiresRembg || false,
      requiresScreenshot: input.requiresWebsiteScreenshot || false,
      requiresColorExtraction: input.requiresColorExtraction || false,
      processLocation: {
        connect: {
          id: input.jobLocationId || '-1'
        }
      }
    });

    if (!input.requiresColorExtraction) {
      const csvData = { 'colour-0': input.primaryColour };
      const csv = papaparse.unparse([csvData]);
      const csvPath = `${input.id}/dominant_colours.csv`;
      await AutodeckService.uploadDataToS3('haas-autodeck-logos', csvPath, csv, 'text/csv')
    }

    if (input.requiresRembg || input.requiresColorExtraction) {
      const fileKey = input?.logoUrl?.split('.com/')[1]
      const logoManipulationEvent = {
        key: fileKey,
        // TODO: Track this as dependency
        bucket: 'haas-autodeck-logos',
        requiresRembg: input.requiresRembg,
        requiresScreenshot: input.requiresWebsiteScreenshot,
        requiresColorExtraction: input.requiresColorExtraction
      }
      const strLogoManipulationEvent = JSON.stringify(logoManipulationEvent, null, 2);
      const logoManipulationSNSParams = {
        Message: strLogoManipulationEvent,
        // TODO: Track this as dependency
        TopicArn: "arn:aws:sns:eu-central-1:118627563984:SalesDeckProcessingChannel"
      }
      sns.publish(logoManipulationSNSParams, (err, data) => {
        if (err) console.log('ERROR: ', err);
      });
    }

    if (input.requiresWebsiteScreenshot) {
      const screenshotEvent: ScreenshotProps = {
        websiteUrl: input.websiteUrl || '',
        // TODO: Track this as dependency
        bucket: 'haas-autodeck-logos',
        jobId: input.id || '',
        requiresRembg: input.requiresRembg,
        requiresScreenshot: input.requiresWebsiteScreenshot,
        requiresColorExtraction: input.requiresColorExtraction
      }
      const strScreenshotEvent = JSON.stringify(screenshotEvent, null, 2);
      const screenshotSNSParams = {
        Message: strScreenshotEvent,
        // TODO: Track this as dependency
        TopicArn: "arn:aws:sns:eu-central-1:118627563984:WebsiteScreenshotChannel"
      };
      sns.publish(screenshotSNSParams, (err, data) => {
        if (err) console.log('ERROR: ', err);
      });
    }

    return workspaceJob;
  }

  static getPreviewData = async (id: string) => {
    const S3_BUCKET_PREFIX = `https://haas-autodeck-logos.s3.eu-central-1.amazonaws.com/${id}`;

    const params = {
      Bucket: 'haas-autodeck-logos',
      Prefix: `${id}/`
    };

    const logoKey = await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) return reject(err);
        const fileWithRembg = data.Contents?.find((file) => file.Key?.includes('/rembg'))
        if (!fileWithRembg) {
          const originalFile = data.Contents?.find((file) => file.Key?.includes('/original'))
          const fileName = originalFile?.Key?.split('/')[1];
          resolve(fileName)
        }
        const fileName = fileWithRembg?.Key?.split('/')[1];
        resolve(fileName);
      });
    });

    const rembgLogoUrl = `${S3_BUCKET_PREFIX}/${logoKey}#${Date.now()}`;

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
      .pipe(new StringStream())
      .CSVParse({ delimiter: ',' })
      .toArray()
      .catch((err: any) => {
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
        .on('error', (err: any) => reject(err))
        .pipe(stream);
      // @ts-ignore
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
