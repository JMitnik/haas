import { PrismaClient } from '@prisma/client';
import uploadCloudinary from '../Common/Upload/Cloudinary/uploadCloudinary';

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
    const image = await uploadCloudinary(file, 'sellable_items');
    return image;
  }
}

export default LinkService;
