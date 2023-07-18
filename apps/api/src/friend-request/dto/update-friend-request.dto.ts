import { IsEnum } from 'class-validator';

export class UpdateFriendRequestDto {
  @IsEnum(['PENDING', 'ACCEPTED', 'REJECTED'])
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
