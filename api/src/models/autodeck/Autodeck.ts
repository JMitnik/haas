
import { enumType, inputObjectType, mutationField, objectType, queryField } from 'nexus';

import AutodeckService from './AutodeckService';
import { PaginationWhereInput } from '../general/Pagination';
import { NexusGenFieldTypes } from '../../generated/nexus';
import { assertNonNullish } from '../../utils/assertNonNullish';

export const JobProcessLocationType = enumType({
  name: 'JobProcessLocationType',
  members: ['ONE_PAGER', 'PITCHDECK', 'BROCHURE'],
});

export const CustomFieldType = objectType({
  name: 'CustomFieldType',
  definition(t) {
    t.string('id')
    t.string('key')
    t.nullable.string('value')
    t.string('jobProcessLocationId')
  },
});

export const JobProcessLocation = objectType({
  name: 'JobProcessLocation',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('path');
    t.int('xMaterialDimension');
    t.int('yMaterialDimension');
    t.field('type', {
      type: JobProcessLocationType,
    })

    t.list.field('customFields', {
      type: CustomFieldType,
      resolve(parent, args, ctx) {
        assertNonNullish(parent.id, 'Cannot find autodeck id!');
        return ctx.services.autodeckService.getCustomFieldsOfJobProcessLocation(parent.id);
      },
    })
  },
})

export const JobProcessLocations = objectType({
  name: 'JobProcessLocations',
  definition(t) {
    t.list.field('jobProcessLocations', {
      type: JobProcessLocation,
    })
  },
})

export const GetJobProcessLocationQuery = queryField('getJobProcessLocations', {
  type: JobProcessLocations,
  async resolve(parent, args, ctx) {
    const jobProcessLocations = await ctx.services.autodeckService.getJobProcessLocations()
    return { jobProcessLocations: jobProcessLocations || [] };
  },
})

export const createJobProcessLocationInput = inputObjectType({
  name: 'createJobProcessLocationInput',
  definition(t) {
    t.string('name');
    t.string('path');
    t.field('type', {
      type: JobProcessLocationType,
    })
  },
})

export const CreateJobProcessLocationMutation = mutationField('createJobProcessLocation', {
  type: JobProcessLocation,
  args: { input: createJobProcessLocationInput },
  resolve(parent, args, ctx) {
    return ctx.services.autodeckService.createJobProcessLocation(args.input);
  },
})

export const CloudReferenceType = enumType({
  name: 'CloudReferenceType',
  members: ['AWS', 'GCP', 'Azure', 'IBM'],
});

export const JobStatusType = enumType({
  name: 'JobStatusType',
  members: ['PENDING', 'PRE_PROCESSING', 'IN_PHOTOSHOP_QUEUE', 'PRE_PROCESSING_LOGO',
    'PRE_PROCESSING_WEBSITE_SCREENSHOT', 'PHOTOSHOP_PROCESSING', 'PROCESSING', 'WRAPPING_UP',
    'COMPLETED', 'FAILED', 'READY_FOR_PROCESSING', 'TRANSFORMING_PSDS_TO_PNGS', 'STITCHING_SLIDES', 'COMPRESSING_SALES_MATERIAL'],
});

export const PreviewDataType = objectType({
  name: 'PreviewDataType',
  definition(t) {
    t.list.string('colors');
    t.string('rembgLogoUrl');
    t.string('websiteScreenshotUrl');
  },
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

    t.nullable.string('resourcesUrl');
    t.nullable.string('updatedAt')
    t.nullable.string('referenceId');
    t.nullable.string('errorMessage');
    t.nullable.string('message');

    t.field('referenceType', {
      type: CloudReferenceType,
    });
    t.field('status', {
      type: JobStatusType,
    });

    t.field('processLocation', {
      type: JobProcessLocation,
      async resolve(parent, args, ctx) {
        if (!parent.id) return null;
        const processLocation = await ctx.services.autodeckService.getJobProcessLocationOfJob(parent.id);

        if (!processLocation) throw Error('Process location not found!');

        return processLocation;
      },
    })
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
    });
  },
});

export const CustomFieldInputType = inputObjectType({
  name: 'CustomFieldInputType',
  definition(t) {
    t.string('key')
    t.string('value')
  },
})

export const GenerateAutodeckInput = inputObjectType({
  name: 'GenerateAutodeckInput',
  description: 'Generate savales documents',

  definition(t) {
    t.nonNull.string('id');
    t.nonNull.boolean('requiresRembgLambda');
    t.nonNull.boolean('requiresWebsiteScreenshot');
    t.nonNull.boolean('requiresColorExtraction');
    t.nonNull.boolean('usesAdjustedLogo');

    t.string('jobLocationId')
    t.string('name');
    t.string('website');
    t.string('logo');
    t.string('primaryColour');
    t.string('firstName');
    t.string('companyName');
    t.string('answer1');
    t.string('answer2');
    t.string('answer3');
    t.string('answer4');
    t.string('sorryAboutX');
    t.string('youLoveX');
    t.string('reward');
    t.string('emailContent');
    t.string('textMessage');

    // Generate workspace
    t.string('slug');
    t.boolean('isGenerateWorkspace');

    t.list.field('standardFields', {
      type: CustomFieldInputType,
    })

    t.list.field('customFields', {
      type: CustomFieldInputType,
    })

    t.list.field('newCustomFields', {
      type: CustomFieldInputType,
    })
  },
});

export const GetPreviewDataQuery = queryField('getPreviewData', {
  type: PreviewDataType,

  args: { id: 'String' },
  async resolve(parent, args) {
    if (!args.id) return null;

    const previewData = await AutodeckService.getPreviewData(args.id);
    return previewData as any;
  },
})

export const GenerateAutodeckMutation = mutationField('generateAutodeck', {
  type: CreateWorkspaceJobType,

  args: { input: GenerateAutodeckInput },

  async resolve(parent, args, ctx) {
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
      jobLocationId: input.jobLocationId,
    }

    const job = await ctx.services.autodeckService.createWorkspaceJob(jobInput);

    return job ? job as any : null;
  },
});

export const RetryAutodeckJobMutation = mutationField('retryAutodeckJob', {
  type: CreateWorkspaceJobType,

  args: { jobId: 'String' },

  async resolve(parent, args, ctx) {
    const { jobId } = args;

    if (!jobId) {
      return null;
    }

    const job = await ctx.services.autodeckService.retryJob(jobId);

    return job ? job as any : null;
  },
});

export const ConfirmCreateWorkspaceJobMutation = mutationField('confirmCreateWorkspaceJob', {
  type: CreateWorkspaceJobType,

  args: { input: GenerateAutodeckInput },
  async resolve(parent, args, ctx) {
    const { input } = args;
    const userId = ctx.session?.user?.id
    if (!input) {
      return null;
    }

    return ctx.services.autodeckService.confirmWorkspaceJob(input, userId) as any;
  },
})

export const GetJobQuery = queryField('getJob', {
  type: CreateWorkspaceJobType,

  args: { id: 'String' },
  async resolve(parent, args, ctx) {
    if (!args.id) return null;
    return ctx.services.autodeckService.getJobById(args.id) as any;
  },
});

export const AutodeckConnectionModel = objectType({
  name: 'AutodeckConnectionType',

  definition(t) {
    t.implements('DeprecatedConnectionInterface');
    t.list.field('jobs', { type: CreateWorkspaceJobType });
  },
});

export const GetAutodeckJobsQuery = queryField('getAutodeckJobs', {
  type: AutodeckConnectionModel,
  args: { filter: PaginationWhereInput },

  async resolve(parent, args, ctx) {
    const { entries, pageInfo } = await ctx.services.autodeckService.paginatedAutodeckJobs({
      limit: args.filter?.limit,
      offset: args.filter?.offset,
      orderBy: args.filter?.orderBy,
      search: args.filter?.searchTerm,
    });

    return {
      jobs: entries as NexusGenFieldTypes['CreateWorkspaceJobType'][],
      pageInfo,
      offset: args.filter?.offset || 0,
      limit: args.filter?.limit || 0,
    };
  },
})

export const AWSImageType = objectType({
  name: 'AWSImageType',
  definition(t) {
    t.string('filename');
    t.string('mimetype');
    t.string('encoding');
    t.string('url');
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
  },
})

export const AdjustedImageInput = inputObjectType({
  name: 'AdjustedImageInput',
  definition(t) {
    t.string('id');
    t.string('key');
    t.string('bucket');
    t.boolean('reset')
  },
})

export const GetAdjustedLogoQuery = queryField('getAdjustedLogo', {
  type: AWSImageType,

  args: { input: AdjustedImageInput },
  resolve(parent, args) {
    if (!args.input) return null;
    return AutodeckService.getAdjustedLogo(args.input);
  },
})

export const WhitifyImageMutation = mutationField('whitifyImage', {
  type: AWSImageType,

  args: { input: AdjustedImageInput },
  resolve(parent, args) {
    if (!args.input) return null;
    AutodeckService.whitifyImage(args.input)
    return { url: 'Succesfully started lambda' }
  },
})

export const RemovePixelRangeMutation = mutationField('removePixelRange', {
  type: AWSImageType,

  args: { input: RemovePixelRangeInput },
  async resolve(parent, args) {
    if (!args.input) return null;

    AutodeckService.removePixelRange(args.input)

    return { url: 'succesfully start lambda i guess' };
  },
})

export const UploadImageEnumType = enumType({
  name: 'UploadImageEnumType',
  members: ['LOGO', 'WEBSITE_SCREENSHOT'],
})

export const UploadImageMutation = mutationField('uploadJobImage', {
  type: AWSImageType,

  args: {
    file: 'Upload',
    jobId: 'String',
    type: UploadImageEnumType,
    disapproved: 'Boolean',
  },
  async resolve(parent, args) {
    const { file, jobId } = args;
    const waitedFile = await file;
    const { createReadStream, filename, mimetype, encoding }:
      { createReadStream: any; filename: string; mimetype: string; encoding: string } = waitedFile.file;

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

    if (fileName !== 'website_screenshot') {
      const message = { 'bucket': 'haas-autodeck-logos', 'key': fileKey };
      AutodeckService.resizeImage(message);
    }

    return { url: awsFileURL };
  },
})

export const UpdateCreatWorkspaceJobMutation = mutationField('updateCreateWorkspaceJob', {
  type: CreateWorkspaceJobType,

  args: { id: 'String', status: JobStatusType, resourceUrl: 'String', referenceId: 'String', errorMessage: 'String' },
  resolve(parent, args, ctx) {
    const { id, resourceUrl, status, errorMessage } = args;
    if (!args.id) {
      return null;
    }

    const updateInput = { id: args.id, resourceUrl, status: status || 'PENDING', errorMessage: errorMessage || undefined };

    return ctx.services.autodeckService.update(updateInput) as any;
  },

});
