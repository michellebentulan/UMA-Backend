import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './conversations.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, User]), // Register repositories
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService], // Export if used in other modules
})
export class ConversationsModule {}
