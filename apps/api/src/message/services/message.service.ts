import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageGateway } from '../sockets/message.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MessageGateway))
    private readonly messageGateway: MessageGateway
  ) {}

  async create(createMessageDto: CreateMessageDto, userId: string) {
    const { conversationId, body } = createMessageDto;

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p) => p.userId === userId)) {
      throw new UnauthorizedException();
    }

    const message = await this.prisma.message.create({
      data: {
        body,
        senderId: userId,
        conversationId,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        latestMessageId: message.id,
      },
    });

    return message;
  }

  async findAll(conversationId: string, userId: string) {
    // Ensure the user is part of the conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation.participants.some((p) => p.userId === userId)) {
      throw new UnauthorizedException();
    }

    return this.prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        conversation: true,
      },
    });
  }
}
