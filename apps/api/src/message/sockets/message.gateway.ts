import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../services/message.service';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSocketMap: { [userId: string]: string } = {};

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    client.on('register', (userId: string) => {
      this.userSocketMap[userId] = client.id;
    });
  }

  handleDisconnect(client: Socket) {
    for (const userId in this.userSocketMap) {
      if (this.userSocketMap[userId] === client.id) {
        delete this.userSocketMap[userId];
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { senderId: string; conversationId: string; body: string }
  ) {
    const newMessage = await this.messageService.create(
      {
        body: payload.body,
        senderId: payload.senderId,
        conversationId: payload.conversationId,
      },
      payload.senderId
    );
    this.server.emit('newMessage', newMessage);
  }
}
