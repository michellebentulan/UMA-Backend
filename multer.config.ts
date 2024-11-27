import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const folder =
        file.fieldname === 'messageImage'
          ? './uploads/message-images'
          : './uploads/livestock-images';
      callback(null, folder);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const prefix =
        file.fieldname === 'messageImage' ? 'message' : 'livestock';
      callback(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestException('Unsupported file type'), false);
    }
    callback(null, true);
  },
};
