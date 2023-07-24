import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConversationDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString({ each: true })
  @IsNotEmpty()
  participants?: string[];
  @IsString()
  @IsNotEmpty()
  latestMessage?: string;
}
