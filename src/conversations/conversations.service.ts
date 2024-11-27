// src/conversations/conversations.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async createOrGetConversation(userIds: number[]): Promise<Conversation> {
  //   const users = await this.userRepository.findByIds(userIds);
  //   if (users.length !== userIds.length) {
  //     throw new Error('Invalid user IDs');
  //   }

  //   // Check if conversation exists
  //   const existingConversation = await this.conversationRepository
  //     .createQueryBuilder('conversation')
  //     .leftJoinAndSelect('conversation.participants', 'participants')
  //     .where('participants.id IN (:...userIds)', { userIds })
  //     .groupBy('conversation.id')
  //     .having('COUNT(participants.id) = :userCount', {
  //       userCount: userIds.length,
  //     })
  //     .getOne();

  //   if (existingConversation) return existingConversation;

  //   // Create a new conversation
  //   const conversation = this.conversationRepository.create({
  //     participants: users,
  //   });
  //   return this.conversationRepository.save(conversation);
  // }

  // async createOrGetConversation(userIds: number[]): Promise<Conversation> {
  //   const users = await this.userRepository.findByIds(userIds);
  //   if (users.length !== userIds.length) throw new Error('Invalid user IDs');

  //   const conversation = await this.conversationRepository
  //     .createQueryBuilder('conversation')
  //     .leftJoinAndSelect('conversation.participants', 'participants')
  //     .where('participants.id IN (:...userIds)', { userIds })
  //     .groupBy('conversation.id')
  //     .having('COUNT(participants.id) = :userCount', {
  //       userCount: userIds.length,
  //     })
  //     .getOne();

  //   if (conversation) {
  //     const newParticipants = users.filter(
  //       (user) => !conversation.participants.some((p) => p.id === user.id),
  //     );
  //     if (newParticipants.length > 0) {
  //       conversation.participants = [
  //         ...conversation.participants,
  //         ...newParticipants,
  //       ];
  //       return this.conversationRepository.save(conversation);
  //     }
  //     return conversation;
  //   }

  //   const newConversation = this.conversationRepository.create({
  //     participants: users,
  //   });
  //   return this.conversationRepository.save(newConversation);
  // }

  async createOrGetConversation(userIds: number[]): Promise<Conversation> {
    let conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'user')
      .where('user.id IN (:...userIds)', { userIds })
      .groupBy('conversation.id')
      .having('COUNT(user.id) = :userCount', { userCount: userIds.length })
      .getOne();

    if (!conversation) {
      const participants = await this.userRepository.findByIds(userIds);
      conversation = this.conversationRepository.create({ participants });
      await this.conversationRepository.save(conversation);
    }

    return conversation;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { participants: { id: userId } },
      relations: ['participants'],
    });
  }

  // src/conversations/conversations.service.ts
  // async getConversationsWithLastMessage(userId: number): Promise<any[]> {
  //   const conversations = await this.conversationRepository
  //     .createQueryBuilder('conversation')
  //     .leftJoinAndSelect('conversation.participants', 'participants')
  //     .leftJoinAndSelect('conversation.messages', 'messages')
  //     .where('participants.id = :userId', { userId })
  //     .orderBy('messages.createdAt', 'DESC')
  //     .getMany();

  //   return conversations.map((conversation) => {
  //     // Ensure `messages` are sorted by `createdAt`
  //     const lastMessage =
  //       conversation.messages.length > 0
  //         ? conversation.messages.sort(
  //             (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  //           )[0]
  //         : null;

  //     return {
  //       id: conversation.id,
  //       participants: conversation.participants.filter((p) => p.id !== userId),
  //       lastMessage,
  //     };
  //   });
  // }

  async getConversationsWithLastMessage(userId: number): Promise<any[]> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .where('participants.id = :userId', { userId })
      .orderBy('messages.createdAt', 'DESC')
      .getMany();

    return conversations.map((conversation) => {
      const lastMessage =
        conversation.messages.length > 0
          ? conversation.messages.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            )[0]
          : null;

      const unreadMessagesCount = conversation.messages.filter(
        (msg) => !msg.isRead && msg.sender.id !== userId,
      ).length;

      return {
        id: conversation.id,
        participants: conversation.participants.filter((p) => p.id !== userId),
        lastMessage,
        unreadMessagesCount,
      };
    });
  }
}
