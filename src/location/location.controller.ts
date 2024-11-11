import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from 'src/dto/create-location.dto';
import { Location } from './location.entity';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationService.createLocation(createLocationDto);
  }

  @Get()
  async getLocation(
    @Query('town') town: string,
    @Query('barangay') barangay: string,
  ): Promise<Location[]> {
    return this.locationService.findLocation(town, barangay);
  }
}
