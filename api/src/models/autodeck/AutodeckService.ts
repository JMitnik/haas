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
import JobProcessLocationPrismaAdapter from './JobProcessLocationPrismaAdapter';
import CreateWorkspaceJobPrismaAdapter from './CreateWorkspaceJobPrismaAdapter';
import { CreateWorkspaceJobProps, ScreenshotProps } from './AutodeckServiceType';

const s3 = new AWS.S3({
  accessKeyId: config.autodeckAwsAccessKeyId,
  secretAccessKey: config.autodeckAwsSecretAccessKey,
  region: 'eu-central-1'
});
const sns = new AWS.SNS({
  region: 'eu-central-1',
  accessKeyId: config.autodeckAwsAccessKeyId,
  secretAccessKey: config.autodeckAwsSecretAccessKey,
});

class AutodeckService {
  customerService: CustomerService;
  jobProcessLocationPrismaAdapter: JobProcessLocationPrismaAdapter;
  createWorkspaceJobPrismaAdapter: CreateWorkspaceJobPrismaAdapter;

  constructor(prismaClient: PrismaClient<PrismaClientOptions, never>) {
    this.customerService = new CustomerService(prismaClient);
    this.jobProcessLocationPrismaAdapter = new JobProcessLocationPrismaAdapter(prismaClient);
    this.createWorkspaceJobPrismaAdapter = new CreateWorkspaceJobPrismaAdapter(prismaClient);
  };

  /**
   * 
   * @param input Update input containing status, resourceUrl and/or errorMessage 
   * @returns An updated CreateWorkspaceJob
   */
  update(input: { id: string; resourceUrl: string | null | undefined; status: "PRE_PROCESSING" | "PRE_PROCESSING_LOGO" | "PRE_PROCESSING_WEBSITE_SCREENSHOT" | "READY_FOR_PROCESSING" | "IN_PHOTOSHOP_QUEUE" | "PHOTOSHOP_PROCESSING" | "PROCESSING" | "WRAPPING_UP" | "PENDING" | "COMPLETED" | "FAILED" | "TRANSFORMING_PSDS_TO_PNGS" | "STITCHING_SLIDES" | "COMPRESSING_SALES_MATERIAL"; errorMessage: string | undefined; }) {
    return this.createWorkspaceJobPrismaAdapter.update(input.id, {
      resourcesUrl: input.resourceUrl,
      status: input.status,
      errorMessage: input.errorMessage,
    });
  };

  /**
   * 
   * @param jobId The id of an Autodeck job
   * @returns An autodeck job
   */
  getJobById(jobId: string) {
    return this.createWorkspaceJobPrismaAdapter.getJobById(jobId);
  };

  /**
   * Find the corresponding Job location by a job ID 
   * @param createWorkspaceJobId The id of an Autodeck job
   * @returns JobProcessLocation prisma entry
   */
  getJobProcessLocationOfJob(createWorkspaceJobId: string): Promise<JobProcessLocation> {
    return this.jobProcessLocationPrismaAdapter.getJobProcessLocationByJobId(createWorkspaceJobId);
  };

  /**
   * Finds all custom fields added to a JobProcessLocation
   * @param jobProcessLocationId The id of a JobProcessLocation entry
   * @returns The custom fields added to a JobProcessLocation
   */
  getCustomFieldsOfJobProcessLocation(jobProcessLocationId: string): Promise<CustomField[]> {
    return this.jobProcessLocationPrismaAdapter.getCustomFieldsByJobProcessLocationId(jobProcessLocationId);
  };

  /**
   * 
   * @returns All JobProcessLocations currently available
   */
  getJobProcessLocations = async () => {
    return this.jobProcessLocationPrismaAdapter.findAll();
  };

  /**
   * Creates a JobProcessLocation prisma entry based on provided input
   * @param input An object containing a display name, folder path and type of a JobProcessLocation
   * @returns A created JobProcessLocation prisma entry
   */
  createJobProcessLocation = async (input: any) => {
    const data = { name: input.name, path: input.path, type: input.type };
    return this.jobProcessLocationPrismaAdapter.create(data);
  };

  /**
   * Finds a subset of all Autodeck jobs
   * @param paginationOpts 
   * @returns An subset of all Autodeck jobs based on pagination input
   */
  paginatedAutodeckJobs = async (
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) => {
    const findManyTriggerArgs: FindManyCreateWorkspaceJobArgs = {
      where: {
        id: {
          not: undefined
        },
      },
      orderBy: {
        updatedAt: 'desc'
      },
    };

    const getAllJobs = async (
      { props: findManyArgs }: FindManyCallBackProps,
    ) => {
      return this.createWorkspaceJobPrismaAdapter.getJobs(findManyArgs);
    };

    const countJobs = async ({ props: countArgs }: FindManyCallBackProps) => this.createWorkspaceJobPrismaAdapter.count(countArgs);

    const paginateProps: PaginateProps = {
      findManyArgs: {
        findArgs: findManyTriggerArgs,
        searchFields: ['name'],
        orderFields: ['updatedAt'],
        findManyCallBack: getAllJobs,
      },
      countArgs: {
        countWhereInput: findManyTriggerArgs,
        countCallBack: countJobs,
      },
      paginationOpts,
    };

    return paginate(paginateProps);
  };

  /**
   * Adds new custom fields to a JobProcessLocation
   * @param input The new custom fields
   * @param processLocationId The id of a JobProcessLocation entry
   * @returns An updated JobProcessLocation entry
   */
  addNewCustomFieldsToTemplate = async (input: NexusGenInputs['GenerateAutodeckInput'], processLocationId: string) => {
    const newCustomFields = input.newCustomFields?.map(({ key, value }) => ({ key: key || '', value: value || '' })) || [];
    return this.jobProcessLocationPrismaAdapter.addNewCustomFields(processLocationId, newCustomFields);
  }

  /**
   * Merges and generates a single object containing all template and custom fields
   * @param input Object containing, the template fields, previously added custom fields and new custom fields
   * @returns A single object containing all fields
   */
  static generateKeyValuePair = (input: NexusGenInputs['GenerateAutodeckInput']) => {
    const mergedCustomFields = input.customFields?.concat(input?.newCustomFields || []).concat(input?.standardFields || []) || [];
    let mappedKeyValuePairs = {}
    mergedCustomFields.forEach(({ key, value }) => {
      if (key) Object.assign(mappedKeyValuePairs, { [key]: value });
    });

    return mappedKeyValuePairs;
  };

  /**
   * Checks whether an adjusted (post-edited after background removal etc.) logo is available on S3
   * @param id The id of an Autodeck job
   * @returns A boolean indicating whether an adjusted logo is available
   */
  static usesAdjustedLogo = async (id: string) => {
    const params = {
      Bucket: 'haas-autodeck-logos',
      Prefix: `${id}/`
    };

    return await new Promise((resolve, reject) => {
      s3.listObjectsV2(params, (err, data) => {
        if (err) return reject(err);
        const fileWithAdjusted = data.Contents?.find((file) => file.Key?.includes('/adjusted'));
        if (!fileWithAdjusted) {
          resolve(false);
        };
        resolve(true);
      });
    });
  };

  /**
   * Restarts a job
   * @param jobId The ID of the job that needs be restarted
   * @returns An updated Autodeck job entry
   */
  retryJob = async (jobId: string) => {
    const updatedWorkspaceJob = await this.createWorkspaceJobPrismaAdapter.updateStatus(jobId, 'IN_PHOTOSHOP_QUEUE');

    const usesAdjustedLogo = await AutodeckService.usesAdjustedLogo(jobId);
    const photoshopInput = { jobId, usesAdjustedLogo, rootFolder: updatedWorkspaceJob?.processLocation?.path };
    const strEvent = JSON.stringify(photoshopInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      // TODO: Track this as dependency
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:PhotoshopChannel",
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });
    return updatedWorkspaceJob;
  }

  /**
   * Updates a new Autodeck job when pre-processing is accepted, and starts the photoshop process.
   * @param input 
   * @param userId The ID of the user creating the job
   * @returns An updated autodeck job
   */
  confirmWorkspaceJob = async (input: NexusGenInputs['GenerateAutodeckInput'], userId?: string) => {
    const csvData = { 'colour-0': input.primaryColour };
    const csv = papaparse.unparse([csvData]);
    const csvPath = `${input.id}/dominant_colours.csv`;
    await AutodeckService.uploadDataToS3('haas-autodeck-logos', csvPath, csv, 'text/csv');

    const updatedWorkspaceJob = await this.createWorkspaceJobPrismaAdapter.upsert(input.id, {
      id: input.id || '',
      name: input.name || '',
      status: 'IN_PHOTOSHOP_QUEUE',
      referenceType: 'AWS',
      requiresColorExtraction: false,
      requiresRembg: false,
      requiresScreenshot: false,
      processLocationId: input.jobLocationId || '-1',
    }, {
      status: 'IN_PHOTOSHOP_QUEUE',
    });

    const processLocationId = updatedWorkspaceJob.jobProcessLocationId;
    await this.addNewCustomFieldsToTemplate(input, processLocationId);

    const mappedCustomFields = AutodeckService.generateKeyValuePair(input);

    const pitchdeckData: any = {
      ...mappedCustomFields,
      rootPath: updatedWorkspaceJob.processLocation.path,
    };

    const pitchdeckCSV = papaparse.unparse([pitchdeckData]);
    const pitchdeckCSVPath = `${input.id}/pitchdeck_input.csv`;
    await AutodeckService.uploadDataToS3('haas-autodeck-logos', pitchdeckCSVPath, pitchdeckCSV, 'text/csv');

    const photoshopInput = {
      jobId: updatedWorkspaceJob.id,
      usesAdjustedLogo: input.usesAdjustedLogo,
      rootFolder: updatedWorkspaceJob.processLocation.path
    };
    const strEvent = JSON.stringify(photoshopInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      // TODO: Track this as dependency
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:PhotoshopChannel",
    };

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
        };
        await this.customerService.createWorkspace(workspaceInput, userId)
      } catch (e) {
        console.log('Something went wrong: ', e)
      };
    };

    return updatedWorkspaceJob;
  };

  /**
   * Finds the adjusted pre-processing logo on S3
   * @param adjusedLogoInput An object containing:
   * - A Autodeck job id (string)
   * - A S3 bucket (string)
   * - A S3 File key (string)
   * - A reset property (boolean)
   * @returns An object containing the url to an adjusted logo
   */
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
            resolve(fileName);
          };
          const fileName = fileWithRembg?.Key?.split('/')[1];
          resolve(fileName);
        };

        const adjustedFile = data.Contents?.find((file) => file.Key?.includes('adjusted'));
        if (!adjustedFile) {
          const fileWithRembg = data.Contents?.find((file) => file.Key?.includes('/rembg'))
          if (!fileWithRembg) {
            const originalFile = data.Contents?.find((file) => file.Key?.includes('/original'))
            const fileName = originalFile?.Key?.split('/')[1];
            resolve(fileName);
          }
          const fileName = fileWithRembg?.Key?.split('/')[1];
          resolve(fileName);
        }
        const adjustedFileName = adjustedFile?.Key?.split('/')[1];
        resolve(adjustedFileName);
      });
    });

    const adjustedLogoUrl = `${S3_BUCKET_PREFIX}/${logoKey}#${Date.now()}`;
    return { url: adjustedLogoUrl };
  }

  /**
   * Starts the whitify lambda 
   * @param whitifyImageInput An object containing:
   * - A Autodeck job id (string)
   * - A S3 bucket (string)
   * - A S3 File key (string)
   * - A reset property (boolean)
   */
  static whitifyImage = (whitifyImageInput: NexusGenInputs['AdjustedImageInput']) => {
    const strEvent = JSON.stringify(whitifyImageInput, null, 2);
    const sNSParams = {
      Message: strEvent,
      TopicArn: "arn:aws:sns:eu-central-1:118627563984:WhitifyImageChannel",
    }
    sns.publish(sNSParams, (err, data) => {
      if (err) console.log('ERROR: ', err);
    });
  }

  /**
   * Starts the resizeImage lambda
   * @param input object containing S3 bucket and S3 key properties
   */
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

  /**
   * Start the removePixel lambda
   * @param removePixelRangeEventInput 
   */
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

  /**
   * Creates a new Autodeck job
   * @param input An object containing info in regard to what pre-processing needs to be done.
   * @returns A created autodeck job
   */
  createWorkspaceJob = async (input: CreateWorkspaceJobProps) => {
    const workspaceJob = await this.createWorkspaceJobPrismaAdapter.create({
      id: input.id || '',
      name: input.name,
      status: 'PRE_PROCESSING',
      referenceType: 'AWS',
      requiresRembg: input.requiresRembg || false,
      requiresScreenshot: input.requiresWebsiteScreenshot || false,
      requiresColorExtraction: input.requiresColorExtraction || false,
      processLocationId: input.jobLocationId || '-1'
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

  /**
   * Finds the pre-processed data (logo, website) that needs to be reviewed
   * @param id The id of the autodeck job
   * @returns An object containing:
   * - Array of most dominant colours of logo
   * - Url to pre-processed logo
   * - Url to website screenshot
   */
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
  };

  /**
   * Uploads a file to a S3 bucket
   * @param bucket 
   * @param fileKey 
   * @param data file as a stream
   * @param mimeType 
   */
  static uploadDataToS3 = (bucket: string, fileKey: string, data: string, mimeType: string) => {
    return s3.upload({
      Bucket: bucket,
      Key: fileKey,
      Body: data,
      ACL: 'private',
      ContentType: mimeType,
    }).promise();
  };

  /**
   * Uploads a file to a S3 bucket
   * @param bucket 
   * @param fileKey 
   * @param filePath path to file
   */
  static uploadFileToS3 = (bucket: string, fileKey: string, filePath: string) => {
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
