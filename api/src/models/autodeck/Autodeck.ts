
import { enumType, inputObjectType, mutationField, objectType, queryField } from '@nexus/schema';
import AWS from 'aws-sdk';

import AutodeckService, { CreateWorkspaceJobProps } from './AutodeckService';
import { PaginationWhereInput } from '../general/Pagination';
import { NexusGenFieldTypes } from '../../generated/nexus';
import { Upload } from '../customer/Customer';
import config from '../../config/config';

const s3 = new AWS.S3({ accessKeyId: config.awsAccessKeyId, secretAccessKey: config.awsSecretAccessKey });

export const CloudReferenceType = enumType({
  name: 'CloudReferenceType',
  members: ['AWS', 'GCP', 'Azure', 'IBM'],
});

export const JobStatusType = enumType({
  name: 'JobStatusType',
  members: ['PENDING', 'PRE_PROCESSING', 'IN_PHOTOSHOP_QUEUE', 'PRE_PROCESSING_LOGO',
    'PRE_PROCESSING_WEBSITE_SCREENSHOT', 'PHOTOSHOP_PROCESSING', 'COMPLETED', 'FAILED', 'READY_FOR_PROCESSING'],
});

export const PreviewDataType = objectType({
  name: 'PreviewDataType',
  definition(t) {
    t.list.string('colors');
    t.string('rembgLogoUrl');
    t.string('websiteScreenshotUrl');
  }
})

export const CreateWorkspaceJobType = objectType({
  name: 'CreateWorkspaceJobType',
  definition(t) {
    t.string('id');
    t.string('createdAt')
    t.string('name')
    t.string('updatedAt', { nullable: true })
    t.string('referenceId', { nullable: true });
    t.string('status');
    t.string('resourcesUrl', { nullable: true });
    t.field('referenceType', {
      type: CloudReferenceType,
    });
    t.field('status', {
      type: JobStatusType,
    });
  },
});

export const JobObjectType = objectType({
  name: 'JobObjectType',
  definition(t) {
    t.string('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.string('createWorkspaceJobId');
    t.field('createWorkspaceJob', {
      type: CreateWorkspaceJobType,
      nullable: true,
    });
  },
});

export const GenerateAutodeckInput = inputObjectType({
  name: 'GenerateAutodeckInput',
  description: 'Generate sales documents',

  definition(t) {
    t.string('id', { required: true });
    t.boolean('requiresRembgLambda', { required: true });
    t.boolean('requiresWebsiteScreenshot', { required: true });
    t.boolean('requiresColorExtraction', { required: true });
    t.string('name', { required: false });
    t.string('website', { required: false });
    t.string('logo', { required: false });
    t.string('primaryColour', { required: false });
    t.string('firstName', { required: false });
    t.string('answer1', { required: false });
    t.string('answer2', { required: false });
    t.string('answer3', { required: false });
    t.string('answer4', { required: false });
  },
});

export const GetPreviewDataQuery = queryField('getPreviewData', {
  type: PreviewDataType,
  nullable: true,
  args: { id: 'String' },
  async resolve(parent, args) {
    if (!args.id) return null;

    const previewData = await AutodeckService.getPreviewData(args.id);
    return previewData as any;
  }
})

export const GenerateAutodeckMutation = mutationField('generateAutodeck', {
  type: CreateWorkspaceJobType,
  nullable: true,
  args: { input: GenerateAutodeckInput },

  async resolve(parent, args) {
    const { input } = args;

    if (!input) {
      return null;
    }
    const jobInput = {
      id: input.id, 
      name: input.name, 
      websiteUrl: input.website, 
      logoUrl: input.logo, 
      requiresRembg: input.requiresRembgLambda,
      requiresWebsiteScreenshot: input.requiresWebsiteScreenshot,
      requiresColorExtraction: input.requiresColorExtraction,
    }

    console.log('Job input: ', jobInput);
    const job = await AutodeckService.createWorkspaceJob(jobInput);

    return job ? job as any : null;
  },
});

export const ConfirmCreateWorkspaceJobMutation = mutationField('confirmCreateWorkspaceJob', {
  type: CreateWorkspaceJobType,
  nullable: true,
  args: { input: GenerateAutodeckInput },
  async resolve(parent, args) {
    const { input } = args;

    if (!input) {
      return null;
    }

    const confirmInput: CreateWorkspaceJobProps = {
      id: input.id,
      answer1: input?.answer1,
      answer2: input?.answer2,
      answer3: input?.answer3,
      answer4: input?.answer4,
      firstName: input?.firstName
    }
    return AutodeckService.confirmWorkspaceJob(confirmInput) as any;
  }
})

export const GetJobQuery = queryField('getJob', {
  type: CreateWorkspaceJobType,
  nullable: true,
  args: { id: 'String' },
  async resolve(parent, args, ctx) {
    if (!args.id) return null;

    const job = await ctx.prisma.createWorkspaceJob.findOne({
      where: {
        id: args.id,
      },
    });

    return job ? job as any : null;
    // return null;
  },
});

export const AutodeckConnectionModel = objectType({
  name: 'AutodeckConnectionType',

  definition(t) {
    t.implements('ConnectionInterface');
    t.list.field('jobs', { type: CreateWorkspaceJobType });
  }
});

export const GetAutodeckJobsQuery = queryField('getAutodeckJobs', {
  type: AutodeckConnectionModel,
  args: { filter: PaginationWhereInput },

  async resolve(parent, args) {
    const { entries, pageInfo } = await AutodeckService.paginatedAutodeckJobs({
      limit: args.filter?.limit,
      offset: args.filter?.offset,
      orderBy: args.filter?.orderBy,
      search: args.filter?.searchTerm,
    });

    return {
      jobs: entries as NexusGenFieldTypes['CreateWorkspaceJobType'][],
      pageInfo,
      offset: args.filter?.offset || 0,
      limit: args.filter?.limit || 0
    };
  },
})

export const AWSImageType = objectType({
  name: 'AWSImageType',
  definition(t) {
    t.string('filename', { nullable: true });
    t.string('mimetype', { nullable: true });
    t.string('encoding', { nullable: true });
    t.string('url', { nullable: true });
  },
});

export const UploadImageEnumType = enumType({
  name: 'UploadImageEnumType',
  members: ['LOGO', 'WEBSITE_SCREENSHOT']
})

export const UploadImageMutation = Upload && mutationField('uploadJobImage', {
  type: AWSImageType,
  nullable: true,
  args: {
    file: Upload,
    jobId: "String",
    type: UploadImageEnumType,
  },
  async resolve(parent, args) {
    const { file, jobId } = args;
    const { createReadStream, filename, mimetype, encoding }:
      { createReadStream: any, filename: string, mimetype: string, encoding: string } = await file;

    console.log('file: ', file)
    console.log('aws key: ', config.awsAccessKeyId)
    const extension = filename.split('.')[1]
    console.log('args type: ', args.type);
    const fileName = args.type === 'LOGO' ? 'original' : 'website_screenshot'
    const fileKey = `${jobId}/${fileName}.${extension}`

    const uploadedFile = await AutodeckService.uploadDataToS3('haas-autodeck-logos', fileKey, createReadStream(), mimetype)
      .catch((err) => console.log('error: ', err))

    // console.log('Uploaded file: ', uploadedFile)
    const awsFileURL = `https://haas-autodeck-logos.s3.eu-central-1.amazonaws.com/${fileKey}`

    return { url: awsFileURL };
  },
})

export const UpdateCreatWorkspaceJobMutation = mutationField('updateCreateWorkspaceJob', {
  type: CreateWorkspaceJobType,
  nullable: true,
  args: { id: 'String', status: JobStatusType, resourceUrl: 'String', referenceId: 'String' },
  resolve(parent, args, ctx) {
    const { id, resourceUrl, status } = args;

    if (!args.id) {
      return null;
    }

    return ctx.prisma.createWorkspaceJob.update({
      where: {
        id: id || undefined,
      },
      data: {
        resourcesUrl: resourceUrl,
        status: status || undefined,
      },

    }) as any;
  },

});

export const UpdateJobMutation = mutationField('updateJob', {
  type: JobObjectType,
  nullable: true,
  args: { id: 'String', status: JobStatusType, resourceUrl: 'String', referenceId: 'String' },
  resolve(parent, args, ctx) {
    const { id, resourceUrl, status } = args;

    if (!args.id) {
      return null;
    }

    return ctx.prisma.job.update({
      where: {
        id: id || undefined,
      },
      data: {
        createWorkspaceJob: {
          update: {
            resourcesUrl: resourceUrl,
            status: status || undefined,
          },
        },
      },
      include: {
        createWorkspaceJob: true,
      },
    }) as any;
  },

});
