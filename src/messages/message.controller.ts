import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.sendMessage(createMessageDto);
  }

  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return await this.messageService.getMessagesByConversation(
      Number(conversationId),
    );
  }
}
