import cloudinary from 'cloudinary';

class ImageUploadService {
  cloudinary: any;

  constructor(cloud_name: string, api_key: string, api_secret: string) {
    this.cloudinary = cloudinary.v2.config({
      cloud_name,
      api_key,
      api_secret,
    });
  }
}

export default ImageUploadService;
