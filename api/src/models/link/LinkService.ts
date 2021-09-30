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
    return UploadFileService.uploadCloudinary(file, 'sellable_items');
  }
}

export default LinkService;
