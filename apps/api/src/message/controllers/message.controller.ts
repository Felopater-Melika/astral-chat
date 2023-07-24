import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @GetUser() user) {
    console.log('createMessageDto', createMessageDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.messageService.create(createMessageDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('conversationId') conversationId: string, @GetUser() user) {
    if (!conversationId) {
      throw new BadRequestException('conversationId must be provided');
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.messageService.findAll(conversationId, user.id);
  }
}
