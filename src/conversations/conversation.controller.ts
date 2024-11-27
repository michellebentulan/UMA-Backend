// src/conversations/conversations.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { CreateOrGetConversationDto } from './dto/create-conversation.dto';
import { Request } from 'express';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createOrGetConversation(
    @Body() createOrGetConversationDto: CreateOrGetConversationDto,
  ) {
    return this.conversationService.createOrGetConversation(
      createOrGetConversationDto.userIds,
    );
  }

  @Get()
  async getUserConversations(@Req() req: Request) {
    const userId = req['user']?.id;
    if (!userId) {
      console.error('User ID not found in request');
      throw new UnauthorizedException('User is not authenticated');
    }

    return this.conversationService.getUserConversations(userId);
  }

  @Get('with-last-message')
  async getConversationsWithLastMessage(@Query('userId') userId: number) {
    return this.conversationService.getConversationsWithLastMessage(userId);
  }
}
