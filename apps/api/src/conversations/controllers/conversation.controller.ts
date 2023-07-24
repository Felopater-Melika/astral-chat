import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @GetUser() user
  ) {
    return this.conversationService.create(createConversationDto, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.conversationService.findAll(user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.conversationService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.conversationService.remove(id, user.id);
  }
}
