import cloudinary, { UploadApiResponse } from 'cloudinary';

interface UploadFile {
  createReadStream: Function,
  filename: string,
  mimetype: string,
  encoding: string
}

/**
 * @file input file object
 * @folder folder on cloudinary
 */
module.exports = async (file: UploadFile, folder: string) => {
  const { createReadStream, filename, mimetype, encoding } = file;
  const stream = new Promise<UploadApiResponse>((resolve, reject) => {
    const cld_upload_stream = cloudinary.v2.uploader.upload_stream({
      folder: folder,
      resource_type: 'auto',
    },
      (error, result: UploadApiResponse | undefined) => {
        if (result) return resolve(result);

        return reject(error);
      });

    return createReadStream().pipe(cld_upload_stream);
  });

  const result = await stream;
  const { secure_url } = result;
  console.log('SECURE URL: ', secure_url);
  return { filename, mimetype, encoding, url: secure_url };
};
