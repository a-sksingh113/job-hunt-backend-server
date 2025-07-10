import multer, { StorageEngine } from 'multer';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import { Options } from 'multer-storage-cloudinary';

const config: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
};

cloudinary.config(config);

const storage: StorageEngine = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File): Promise<Options['params']> => {
    const isVideo = file.mimetype.startsWith('video/');
    const isPdf = file.mimetype === 'application/pdf';

    const fileExt = file.originalname.split('.').pop() || 'file';
    const baseName = file.originalname
      .replace(/\.[^/.]+$/, '') 
      .replace(/\s+/g, '_')     
      .replace(/\W+/g, '');     

    const publicId = `${Date.now()}_${baseName}.${fileExt}`;

    const params: Record<string, any> = {
      folder: 'uploads',
      public_id: publicId,
      resource_type: isPdf ? 'raw' : isVideo ? 'video' : 'image',
    };

    if (!isPdf) {
      params.format = fileExt;
    }

    return params;
  },
});

const upload = multer({ storage });

export default upload;
