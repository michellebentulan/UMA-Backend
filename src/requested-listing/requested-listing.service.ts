import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestedListing } from './requested-listing.entity';
import { CreateRequestedListingDto } from './dto/requested-listing.dto';

@Injectable()
export class RequestedListingService {
  constructor(
    @InjectRepository(RequestedListing)
    private readonly requestedListingRepository: Repository<RequestedListing>,
  ) {}

  async createListing(
    data: CreateRequestedListingDto,
  ): Promise<RequestedListing> {
    const listing = this.requestedListingRepository.create({
      ...data,
      user: { id: data.user_id }, // Associate user with the listing
    });
    return this.requestedListingRepository.save(listing);
  }

  async getAllListings(): Promise<RequestedListing[]> {
    return this.requestedListingRepository.find({ relations: ['user'] });
  }

  async getListingById(id: number): Promise<RequestedListing> {
    return this.requestedListingRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
