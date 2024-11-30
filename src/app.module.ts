import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
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
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { SessionService } from './sessions/session.service';
import { SessionMiddleware } from './sessions/session.middleware';
import { Session } from './sessions/session.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // Prevent searching for index.html
        fallthrough: false, // Prevent express.static from trying to find other default paths if nothing matches
        setHeaders: (res, path, stat) => {
          res.set('Cache-Control', 'public, max-age=31536000');
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'uma',
      password: 'uma_password',
      database: 'uma_db',
      entities: [Session, User, __dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Session, User]),
    ScheduleModule.forRoot(),
    UserModule,
    LocationModule,
    LivestockListingModule,
    RequestedListingModule,
    PriceSuggestionModule,
    AdminAccountModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [LivestockController],
  providers: [ImageRecognitionService, SessionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .forRoutes(
        { path: 'conversations/*', method: RequestMethod.ALL },
        { path: 'messages/*', method: RequestMethod.ALL },
      );
  }
}
