import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto, userId: string) {
    const { participants } = createConversationDto;

    // Ensure the current user is part of the conversation
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        participants: {
          create: participants.map((participantId) => ({
            userId: participantId,
            hasSeenLatestMessage: false,
          })),
        },
      },
    });

    return conversation;
  }

  async findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: true,
        messages: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p) => p.userId === userId)) {
      throw new UnauthorizedException();
    }

    return conversation;
  }

  async remove(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p) => p.userId === userId)) {
      throw new UnauthorizedException();
    }

    await this.prisma.conversation.delete({ where: { id } });

    return { message: 'Conversation deleted successfully' };
  }
}
