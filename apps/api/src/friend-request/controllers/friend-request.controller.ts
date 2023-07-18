import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  UnauthorizedException,
  Body,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { CreateFriendRequestDto } from '../dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dto/update-friend-request.dto';
import { FriendRequestService } from '../services/friend-request.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  create(@Body() dto: CreateFriendRequestDto, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.friendRequestService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findAll(@Param('userId') userId: string, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.friendRequestService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFriendRequestDto,
    @GetUser() user
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.friendRequestService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.friendRequestService.remove(id);
  }
}
