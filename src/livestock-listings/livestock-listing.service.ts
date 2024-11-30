import { Injectable, NotFoundException } from '@nestjs/common';
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
    const listings = await this.listingRepository.find({
      relations: ['user'],
    });

    // Filtering out listings without valid user relations
    const validListings = listings.filter((listing) => listing.user != null);
    return validListings;
  }

  async getListingById(id: number): Promise<LivestockListing> {
    // Use 'relations' to load user data for a single listing
    return this.listingRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async deleteListing(listingId: number, userId: number): Promise<void> {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, user_id: userId },
    });

    if (!listing) {
      throw new NotFoundException(
        'Listing not found or you do not have permission to delete it.',
      );
    }

    await this.listingRepository.remove(listing);
  }
}
