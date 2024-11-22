import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestedListing } from './requested-listing.entity';
import { RequestedListingService } from './requested-listing.service';
import { RequestedListingController } from './requested-listing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RequestedListing])],
  providers: [RequestedListingService],
  controllers: [RequestedListingController],
  exports: [RequestedListingService],
})
export class RequestedListingModule {}
