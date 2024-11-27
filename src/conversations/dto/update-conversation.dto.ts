import { PartialType } from '@nestjs/mapped-types';
import { CreateOrGetConversationDto } from './create-conversation.dto';

export class UpdateConversationDto extends PartialType(
  CreateOrGetConversationDto,
) {
  id: number;
}
