import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LivestockListing } from './livestock-listing.entity';

@Injectable()
export class LivestockListingService {
  constructor(
    @InjectRepository(LivestockListing)
    private readonly listingRepository: Repository<LivestockListing>,
  ) {}

  async createListing(
    data: Partial<LivestockListing>,
  ): Promise<LivestockListing> {
    const listing = this.listingRepository.create(data);
    return this.listingRepository.save(listing);
  }

  async getListings(): Promise<LivestockListing[]> {
    const listings = await this.listingRepository.find();
    return listings; // Explicitly return an array
  }

  async getListingById(id: number): Promise<LivestockListing> {
    return this.listingRepository.findOne({ where: { id } }); // Return a single listing
  }
}
