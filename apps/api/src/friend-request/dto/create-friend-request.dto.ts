import { IsNotEmpty } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  recipientId: string;
}
