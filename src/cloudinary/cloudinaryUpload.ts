import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinaryConfig';

const getUploader = (folderName: string): multer.Multer => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async() => ({
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    }),
  });

  return multer({ storage });
};

export default getUploader;
