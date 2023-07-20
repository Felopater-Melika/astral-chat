import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

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

    return message;
  }

  async findAll(userId: string) {
    return this.prisma.message.findMany({
      where: {
        senderId: userId,
      },
      include: {
        conversation: true,
      },
    });
  }
}
