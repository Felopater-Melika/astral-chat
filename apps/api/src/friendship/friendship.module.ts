import { Module } from '@nestjs/common';
import { FriendshipController } from './controllers/friendship.controller';
import { FriendshipService } from './services/friendship.service';

@Module({
  controllers: [FriendshipController],
  providers: [FriendshipService],
})
export class FriendshipModule {}
