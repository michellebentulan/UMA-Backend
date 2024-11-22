import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageRecognitionService } from './image-recognition.service';

@Controller('livestock')
export class LivestockController {
  constructor(
    private readonly imageRecognitionService: ImageRecognitionService,
  ) {}

  // @Post('analyze-images')
  // @UseInterceptors(FilesInterceptor('files')) // Ensure 'files' matches the frontend form data key
  // async analyzeImages(@UploadedFiles() files: Express.Multer.File[]) {
  //   const validImages = [];
  //   const invalidImages = [];

  //   for (const file of files) {
  //     if (!file || !file.buffer) {
  //       throw new Error('Invalid file upload');
  //     }

  //     const tags = await this.imageRecognitionService.analyzeImage(file);

  //     if (this.imageRecognitionService.isLivestock(tags)) {
  //       validImages.push({ uri: file.originalname });
  //     } else {
  //       invalidImages.push({ uri: file.originalname });
  //     }
  //   }

  //   return { validImages, invalidImages };
  // }

  @Post('analyze-images')
  @UseInterceptors(FilesInterceptor('files'))
  async analyzeImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('livestockType') livestockType: string,
  ) {
    const validImages = [];
    const invalidImages = [];

    for (const file of files) {
      if (!file || !file.buffer) {
        throw new Error('Invalid file upload');
      }

      const tags = await this.imageRecognitionService.analyzeImage(file);

      if (
        this.imageRecognitionService.isLivestock(tags) &&
        this.imageRecognitionService.isSpecificLivestock(tags, livestockType)
      ) {
        validImages.push({ uri: file.originalname });
      } else {
        invalidImages.push({ uri: file.originalname });
      }
    }

    return { validImages, invalidImages };
  }
}
