import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../services/message.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { senderId: string; conversationId: string; body: string }
  ) {
    const newMessage = await this.messageService.create(
      payload,
      payload.senderId
    );
    client.emit('newMessage', newMessage);
  }
}
