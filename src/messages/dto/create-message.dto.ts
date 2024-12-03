import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  conversationId: number;

  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
