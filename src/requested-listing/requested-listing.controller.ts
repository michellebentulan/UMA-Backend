import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RequestedListingService } from './requested-listing.service';
import { CreateRequestedListingDto } from './dto/requested-listing.dto';

@Controller('requested-listings')
export class RequestedListingController {
  constructor(
    private readonly requestedListingService: RequestedListingService,
  ) {}

  @Post()
  async createListing(@Body() data: CreateRequestedListingDto) {
    return this.requestedListingService.createListing(data);
  }

  @Get()
  async getAllListings() {
    return this.requestedListingService.getAllListings();
  }

  @Get(':id')
  async getListingById(@Param('id') id: number) {
    return this.requestedListingService.getListingById(id);
  }
}
