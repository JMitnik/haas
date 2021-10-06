import { PrismaClient } from '@prisma/client';
import UploadFileService from '../../utils/upload/UploadFileService';

class LinkService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Uploads file to sellable_items folder on cloudinary
   * @file The 'awaited' file coming from Graphql Upload
   * @returns File object including uploaded image URL
   */
  uploadImage = async (file: any) => {
    const image = await UploadFileService.uploadCloudinary(file, 'sellable_items');
    console.log('LinkService uploadImage: ', image);
    return image;
  }
}

export default LinkService;
