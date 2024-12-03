import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/image-messages', // Save images to the specific folder
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Generate a URL for the uploaded file
    const serverAddress = 'http://192.168.74.149:3000'; // Replace this with your actual server address
    const url = `${serverAddress}/uploads/image-messages/${file.filename}`;
    return { url };
  }

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
