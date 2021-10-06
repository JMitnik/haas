import { mutationField } from '@nexus/schema';
import { ApolloError } from 'apollo-server-express';
import { ImageType, Upload } from '../../customer';

export const UploadSellImageResolver = Upload && mutationField('uploadUpsellImage', {
  type: ImageType,
  nullable: true,
  args: {
    workspaceId: 'String',
    file: Upload,
  },

  async resolve(parent, args, ctx) {
    const { file, workspaceId } = args;
    const waitedFile = await file;
    const readyFile = waitedFile.file;

    if (!workspaceId) throw new ApolloError('No workspace ID provided, cannot upload file');
    return ctx.services.linkService.uploadImage(readyFile);
  },
});

export default [
  UploadSellImageResolver,
]