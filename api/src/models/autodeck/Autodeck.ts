
import { enumType, inputObjectType, mutationField, objectType, queryField } from '@nexus/schema';
import AWS from 'aws-sdk';

import AutodeckService, { CreateWorkspaceJobProps } from './AutodeckService';
import { PaginationWhereInput } from '../general/Pagination';
import { NexusGenFieldTypes } from '../../generated/nexus';
import { Upload } from '../customer/Customer';
import config from '../../config/config';
import { resolve } from 'path';

const s3 = new AWS.S3({ accessKeyId: config.awsAccessKeyId, secretAccessKey: config.awsSecretAccessKey });

export const CloudReferenceType = enumType({
  name: 'CloudReferenceType',
  members: ['AWS', 'GCP', 'Azure', 'IBM'],
});

export const JobStatusType = enumType({
  name: 'JobStatusType',
  members: ['PENDING', 'PRE_PROCESSING', 'IN_PHOTOSHOP_QUEUE', 'PRE_PROCESSING_LOGO',
    'PRE_PROCESSING_WEBSITE_SCREENSHOT', 'PROCESSING', 'WRAPPING_UP' ,'COMPLETED', 'FAILED', 'READY_FOR_PROCESSING'],
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
    t.string('status');
    t.boolean('requiresColorExtraction')
    t.boolean('requiresRembg')
    t.boolean('requiresScreenshot')

    t.string('resourcesUrl', { nullable: true });
    t.string('updatedAt', { nullable: true })
    t.string('referenceId', { nullable: true });

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
    t.boolean('usesAdjustedLogo', { required: true });

    t.string('name', { required: false });
    t.string('website', { required: false });
    t.string('logo', { required: false });
    t.string('primaryColour', { required: false });
    t.string('firstName', { required: false });
    t.string('companyName', { required: false });
    t.string('answer1', { required: false });
    t.string('answer2', { required: false });
    t.string('answer3', { required: false });
    t.string('answer4', { required: false });
    t.string('sorryAboutX', { required: false });
    t.string('youLoveX', { required: false });
    t.string('reward', { required: false });
    t.string('emailContent', { required: false });
    t.string('textMessage', { required: false });
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
      primaryColour: input.primaryColour,
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

    return AutodeckService.confirmWorkspaceJob(input) as any;
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

export const RemovePixelRangeInput = inputObjectType({
  name: 'RemovePixelRangeInput',
  definition(t) {
    t.string('key');
    t.string('bucket');
    t.int('red');
    t.int('green');
    t.int('blue');
    t.int('range');
  }
})

export const AdjustedImageInput = inputObjectType({
  name: 'AdjustedImageInput',
  definition(t) {
    t.string('id', { nullable: true });
    t.string('key', { nullable: true});
    t.string('bucket');
    t.boolean('reset', { nullable: true })
  }
})

export const GetAdjustedLogoQuery = queryField('getAdjustedLogo', {
  type: AWSImageType,
  nullable: true,
  args: { input: AdjustedImageInput },
  resolve(parent, args) {
    console.log('args: ', args)
    if (!args.input) return null;
    console.log('Going to process adjusted logo')
    return AutodeckService.getAdjustedLogo(args.input);
  }
})

export const WhitifyImageMutation = mutationField('whitifyImage', {
  type: AWSImageType,
  nullable: true,
  args: { input : AdjustedImageInput},
  resolve(parent, args) {
    console.log('args input: ', args.input)
    if (!args.input) return null;
    AutodeckService.whitifyImage(args.input)
    return { url: 'Succesfully started lambda'}
  }
})

export const RemovePixelRangeMutation = mutationField('removePixelRange', {
  type: AWSImageType,
  nullable: true,
  args: { input: RemovePixelRangeInput },
  async resolve(parent, args) {
    console.log('args input: ', args.input)
    if (!args.input) return null;
    
    AutodeckService.removePixelRange(args.input)

    return { url: 'succesfully start lambda i guess'};
  }
})

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
    disapproved: "Boolean",
  },
  async resolve(parent, args) {
    const { file, jobId } = args;
    const { createReadStream, filename, mimetype, encoding }:
      { createReadStream: any, filename: string, mimetype: string, encoding: string } = await file;

    const extension = filename.split('.')[1]
    let fileName;

    if (args.type === 'LOGO') {
      fileName = args.disapproved ? 'rembg_logo' : 'original'
    } else {
      fileName = 'website_screenshot'
    }
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
