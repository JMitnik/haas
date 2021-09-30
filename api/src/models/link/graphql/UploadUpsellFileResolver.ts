import { mutationField } from '@nexus/schema';
import { ImageType, Upload } from '../../customer';

export const UploadSellImageResolver = Upload && mutationField('uploadUpsellImage', {
  type: ImageType,
  nullable: true,
  args: {
    file: Upload,
  },

  async resolve(parent, args, ctx) {
    const { file } = args;
    const waitedFile = await file;
    const readyFile = waitedFile.file;
    return ctx.services.linkService.uploadImage(readyFile);
  },
});

export default [
  UploadSellImageResolver,
]