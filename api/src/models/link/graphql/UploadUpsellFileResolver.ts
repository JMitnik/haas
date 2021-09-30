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
    console.log('FILE: ', file);
    const waitedFile = await file;
    console.log('AWAITED FILE: ', waitedFile);
    const readyFile = waitedFile.file;
    console.log('READY FILE: ', readyFile);

    return ctx.services.linkService.uploadImage(readyFile);
  },
});

export default [
  UploadSellImageResolver,
]