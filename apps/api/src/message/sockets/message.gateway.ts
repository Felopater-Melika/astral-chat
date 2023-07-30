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
    console.log(`Client disconnected: ${client.id}`);
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
    console.log('Emitting newMessage event with message:', newMessage);
    this.server.emit('newMessage', newMessage); // change this line
  }

  // This is a placeholder function. You'll need to implement this to determine
  // the recipient ID based on the conversation ID and the sender ID.
  async getRecipientId(
    conversationId: string,
    senderId: string
  ): Promise<string | null> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Find the participant who is not the sender.
    const recipient = conversation.participants.find(
      (p) => p.userId !== senderId
    );

    return recipient ? recipient.userId : null;
  }
}
