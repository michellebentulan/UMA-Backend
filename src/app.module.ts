import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './users/user.module'; // Adjust the path as necessary
import { ServeStaticModule } from '@nestjs/serve-static';
import { LocationModule } from './location/location.module';
import { join } from 'path'; // Import join to handle paths
import { LivestockController } from './livestock/livestock.controller';
import { ImageRecognitionService } from './livestock/image-recognition.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your 'uploads' folder
      serveRoot: '/uploads', // This will be the base URL for accessing the images
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
  ],
  controllers: [LivestockController], // Add LivestockController here
  providers: [ImageRecognitionService], // Add ImageRecognitionService here
})
export class AppModule {}
