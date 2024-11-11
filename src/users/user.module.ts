import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Session } from '../sessions/session.entity';
import { PresenceGateway } from './presence.gateway';
import { LocationModule } from 'src/location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), LocationModule], // Add Session to the imports
  providers: [UserService, PresenceGateway],
  controllers: [UserController],
})
export class UserModule {}
