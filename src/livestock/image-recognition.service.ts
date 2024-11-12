import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class ImageRecognitionService {
  private readonly logger = new Logger(ImageRecognitionService.name);
  private apiKey = 'acc_2c0e3d8a497ddf9';
  private apiSecret = 'a7cec2016823fd6ab71e593bf634d07a';
  private auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString(
    'base64',
  );

  async uploadImageToImagga(file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname);

    try {
      const response = await axios.post(
        'https://api.imagga.com/v2/uploads',
        formData,
        {
          headers: {
            Authorization: `Basic ${this.auth}`,
            ...formData.getHeaders(), // Works with the updated import syntax
          },
        },
      );
      return response.data.result.upload_id;
    } catch (error) {
      this.logger.error(
        'Error uploading image to Imagga:',
        error.response?.data || error.message,
      );
      throw new Error('Image upload failed');
    }
  }

  async analyzeImage(file: Express.Multer.File) {
    const uploadId = await this.uploadImageToImagga(file);

    try {
      const response = await axios.get(
        `https://api.imagga.com/v2/tags?image_upload_id=${uploadId}`,
        {
          headers: { Authorization: `Basic ${this.auth}` },
        },
      );
      return response.data.result.tags;
    } catch (error) {
      this.logger.error(
        'Error analyzing image with Imagga:',
        error.response?.data || error.message,
      );
      throw new Error('Image analysis failed');
    }
  }

  isLivestock(tags: any[]): boolean {
    const livestockTags = ['cow', 'pig', 'goat', 'chicken', 'duck', 'carabao'];
    return tags.some(
      (tag) => livestockTags.includes(tag.tag.en) && tag.confidence > 50,
    );
  }
}
