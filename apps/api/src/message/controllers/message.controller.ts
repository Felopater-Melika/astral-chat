import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
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
    return this.messageService.create(createMessageDto, user.id);
  }

  @Get()
  findAll(@GetUser() user) {
    return this.messageService.findAll(user.id);
  }
}
