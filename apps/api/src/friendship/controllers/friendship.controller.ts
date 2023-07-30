import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FriendshipService } from '../services/friendship.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.friendshipService.findAll(user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.friendshipService.remove(id);
  }
}
