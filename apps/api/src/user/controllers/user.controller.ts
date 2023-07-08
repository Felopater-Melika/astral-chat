import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userService.getUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateUser(@Body() dto: UpdateUserDto, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userService.updateUser(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  deleteUser(@GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userService.deleteUser(user.id);
  }
}
