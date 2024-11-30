import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LivestockListingService } from './livestock-listing.service';
import { multerConfig } from 'multer.config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';

@Controller('livestock-listings')
export class LivestockListingController {
  constructor(private readonly listingService: LivestockListingService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: './uploads/livestock-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          callback(null, `livestock-${uniqueSuffix}`);
        },
      }),
    }),
  )
  async createListing(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('Files received:', files);
    console.log('Request body:', body);

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error('No files uploaded or invalid file structure.');
    }

    const imageUrls = files.map(
      (file) => `uploads/livestock-images/${file.filename}`,
    );

    const listingData = {
      user_id: parseInt(body.user_id, 10),
      type: body.type,
      quantity: parseInt(body.quantity, 10),
      weight_per_kg: parseFloat(body.weight_per_kg),
      price: parseFloat(body.price),
      negotiable: body.negotiable === 'true',
      description: body.description,
      images: imageUrls,
    };

    console.log('Processed Listing Data:', listingData);
    return this.listingService.createListing(listingData);
  }

  @Get()
  async getListings() {
    return this.listingService.getListings();
  }

  @Get(':id')
  async getListingById(@Param('id') id: number) {
    return this.listingService.getListingById(id);
  }

  @Delete(':id/:userId')
  async deleteListing(
    @Param('id') id: number,
    @Param('userId') userId: number,
  ) {
    try {
      await this.listingService.deleteListing(id, userId);
      return { message: 'Listing deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('An error occurred while deleting the listing');
    }
  }
}
