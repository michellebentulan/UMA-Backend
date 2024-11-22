import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivestockListing } from './livestock-listing.entity';
import { LivestockListingService } from './livestock-listing.service';
import { LivestockListingController } from './livestock-listing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LivestockListing])],
  providers: [LivestockListingService],
  controllers: [LivestockListingController],
})
export class LivestockListingModule {}
