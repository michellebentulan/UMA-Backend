import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module'; // Adjust the path as necessary
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Import join to handle paths

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
    UserModule,
  ],
})
export class AppModule {}
