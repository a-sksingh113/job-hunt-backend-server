// src/cloudinary/cloudinaryUpload.ts
import multer, { StorageEngine } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import { Options } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js'; 

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

export { upload };
