import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,

    private messageGateway: MessageGateway,
  ) {}

  // async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
  //   const message = this.messageRepository.create(createMessageDto);
  //   const savedMessage = await this.messageRepository.save(message);

  //   // Broadcasting the message to clients using the gateway
  //   this.messageGateway.server
  //     .to(savedMessage.conversation.id.toString())
  //     .emit('newMessage', savedMessage);

  //   return savedMessage;
  // }

  async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { conversationId, senderId, content, imageUrl } = createMessageDto;

    // Ensure conversation exists
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Save the message
    const message = this.messageRepository.create({
      content,
      imageUrl,
      sender: { id: senderId } as any, // Casting to any to avoid type conflicts
      conversation,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Emit to the correct conversation room
    this.messageGateway.server
      .to(conversationId.toString())
      .emit('newMessage', {
        ...savedMessage,
        sender: { id: senderId }, // You may also include the sender's details
      });

    return savedMessage;
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return await this.messageRepository.find({
      where: { conversation },
      relations: ['sender'],
    });
  }
}
