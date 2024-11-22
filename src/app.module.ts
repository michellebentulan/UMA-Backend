import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './users/user.module'; // Adjust the path as necessary
import { ServeStaticModule } from '@nestjs/serve-static';
import { LocationModule } from './location/location.module';
import { join } from 'path'; // Import join to handle paths
import { LivestockController } from './livestock-image-recognition/livestock.controller';
import { ImageRecognitionService } from './livestock-image-recognition/image-recognition.service';
import { LivestockListingModule } from './livestock-listings/livestock-listing.module';
import { PriceSuggestionModule } from './price-suggestion/price-suggestion.module';
import { AdminAccountModule } from './admin-account/admin-account.module';
import { RequestedListingModule } from './requested-listing/requested-listing.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Path to your 'uploads' folder
      serveRoot: '/uploads', // This will be the base URL for accessing the images
      serveStaticOptions: {
        index: false, // Do not look for index.html
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // Change this to your database type
      host: 'localhost',
      port: 3306,
      username: 'uma',
      password: 'uma_password',
      database: 'uma_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    ScheduleModule.forRoot(),
    UserModule,
    LocationModule,
    LivestockListingModule,
    RequestedListingModule,
    PriceSuggestionModule,
    AdminAccountModule,
  ],
  controllers: [LivestockController], // Add LivestockController here
  providers: [ImageRecognitionService], // Add ImageRecognitionService here
})
export class AppModule {}
