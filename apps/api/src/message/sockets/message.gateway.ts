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
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // This object will store the mapping between user IDs and socket IDs.
  private userSocketMap: { [userId: string]: string } = {};

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // When a client connects, store their user ID and socket ID in the map.
    // The user ID should be sent by the client after connecting.
    client.on('register', (userId: string) => {
      this.userSocketMap[userId] = client.id;
    });
  }

  handleDisconnect(client: Socket) {
    // When a client disconnects, remove them from the map.
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
    this.server.emit('newMessage', newMessage); // change this line
  }
}
