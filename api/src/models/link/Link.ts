import { enumType, inputObjectType, mutationField, objectType } from '@nexus/schema';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import { ImageType, Upload } from '../customer';

import { QuestionNodeType } from '../QuestionNode/QuestionNode';

export const LinkTypeEnumType = enumType({
  name: 'LinkTypeEnumType',
  members: [
    'SOCIAL',
    'API',
    'FACEBOOK',
    'LINKEDIN',
    'WHATSAPP',
    'INSTAGRAM',
    'TWITTER'],
});

export const CTALinkInputObjectType = inputObjectType({
  name: 'CTALinkInputObjectType',
  definition(t) {
    t.string('url');
    t.field('type', { type: LinkTypeEnumType });

    t.string('id', { nullable: true });
    t.string('title', { nullable: true });
    t.string('iconUrl', { nullable: true });
    t.string('backgroundColor', { nullable: true });
  },
});

export const CTALinksInputType = inputObjectType({
  name: 'CTALinksInputType',
  definition(t) {
    t.list.field('linkTypes', {
      type: CTALinkInputObjectType,
    });
  },
});

export const LinkType = objectType({
  name: 'LinkType',
  definition(t) {
    t.string('id');
    t.string('url');
    t.string('questionNodeId', { nullable: true });
    t.string('type');

    t.string('title', { nullable: true });
    t.string('iconUrl', { nullable: true });
    t.string('backgroundColor', { nullable: true });

    t.field('questionNode', {
      type: QuestionNodeType,
      async resolve(parent, args, ctx) {
        const questionNode = await ctx.services.nodeService.findNodeByLinkId(parent.id);

        if (!questionNode) throw new Error('Unable to find related node');

        return questionNode;
      },
    });
  },
});

export const UploadSellImageMutation = Upload && mutationField('uploadUpsellImage', {
  type: ImageType,
  nullable: true,
  args: {
    file: Upload,
  },

  async resolve(parent, args) {
    const { file } = args;

    const waitedFile = await file;
    const { createReadStream, filename, mimetype, encoding }:
      { createReadStream: any, filename: string, mimetype: string, encoding: string } = waitedFile.file;


    const stream = new Promise<UploadApiResponse>((resolve, reject) => {
      const cld_upload_stream = cloudinary.v2.uploader.upload_stream({
        folder: 'sellable_items',
      },
        (error, result: UploadApiResponse | undefined) => {
          if (result) return resolve(result);

          return reject(error);
        });

      return createReadStream().pipe(cld_upload_stream);
    });

    const result = await stream;
    const { secure_url } = result;
    return { filename, mimetype, encoding, url: secure_url };
  },
});

export const WorkspaceMutations = Upload && mutationField({
  name: 'uploadUpsellImage',
  definition(t) {
    t.field('singleUpload', {
      type: ImageType,
      args: {
        file: Upload,
      },
      async resolve(parent, args) {
        const { file } = args;

        const waitedFile = await file;
        const { createReadStream, filename, mimetype, encoding }:
          { createReadStream: any, filename: string, mimetype: string, encoding: string } = waitedFile.file;


        const stream = new Promise<UploadApiResponse>((resolve, reject) => {
          const cld_upload_stream = cloudinary.v2.uploader.upload_stream({
            folder: 'company_logos',
          },
            (error, result: UploadApiResponse | undefined) => {
              if (result) return resolve(result);

              return reject(error);
            });

          return createReadStream().pipe(cld_upload_stream);
        });

        const result = await stream;
        const { secure_url } = result;
        return { filename, mimetype, encoding, url: secure_url };
      },
    });
  },
});

export default [
  UploadSellImageMutation,
  CTALinkInputObjectType,
  CTALinksInputType,
  LinkType,
  LinkTypeEnumType,
];
