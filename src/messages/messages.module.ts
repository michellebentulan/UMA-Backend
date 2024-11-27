import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { User } from '../users/user.entity';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MessageController } from './message.controller';
import { Session } from 'src/sessions/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, User, Session]), // Register repositories
  ],
  controllers: [MessageController], // Register the controller
  providers: [MessageGateway, MessageService], // Register providers
  exports: [MessageService], // Export the service if needed in other modules
})
export class MessagesModule {}
