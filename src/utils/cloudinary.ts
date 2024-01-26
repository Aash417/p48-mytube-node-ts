import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const res: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: 'auto',
      }
    );
    // console.log(`from cloudinary : res : `, res);
    // console.log('file has been uploaded on cloudinary.', res.url);

    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    // unlink/delete locally saved temp file as upload got failed.

    fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
