import { MessageDto } from './message.dto';

export class ConversationDto {
  id: string;
  participants: string[];
  latestMessage: MessageDto;
}
