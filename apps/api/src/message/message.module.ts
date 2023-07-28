import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MessageGateway } from './sockets/message.gateway';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
