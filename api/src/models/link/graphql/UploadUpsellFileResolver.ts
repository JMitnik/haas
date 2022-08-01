import { inputObjectType, mutationField } from 'nexus';
import { UserInputError } from 'apollo-server-express';
import { ImageType } from '../../customer';

export const UploadSellImageInputType = inputObjectType({
  name: 'UploadSellImageInputType',
  definition(t) {
    t.upload('file');
    t.string('workspaceId');
  },
})

export const UploadSellImageResolver = mutationField('uploadUpsellImage', {
  type: ImageType,
  nullable: true,
  args: {
    input: UploadSellImageInputType,
  },

  async resolve(parent, args, ctx) {
    const waitedFile = await args.input?.file;
    const readyFile = waitedFile.file;

    if (!args?.input?.workspaceId) throw new UserInputError('No workspace ID provided, cannot upload file');
    const uploadImage = await ctx.services.linkService.uploadImage(readyFile);
    return uploadImage;
  },
});

export default [
  UploadSellImageResolver,
  UploadSellImageInputType,
]