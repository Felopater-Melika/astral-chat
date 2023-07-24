import {
  BadRequestException,
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

    console.log('Participants', participants);

    if (participants.length === 0) {
      throw new NotFoundException('Participants not found');
    }

    if (new Set(participants).size !== participants.length) {
      throw new BadRequestException(
        'Participants array contains duplicate user IDs'
      );
    }

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

    await this.prisma.message.deleteMany({
      where: { conversationId: id },
    });

    await this.prisma.conversationParticipant.deleteMany({
      where: { conversationId: id },
    });

    await this.prisma.conversation.delete({ where: { id } });

    return { message: 'Conversation deleted successfully' };
  }
}
