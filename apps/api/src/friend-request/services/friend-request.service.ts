import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFriendRequestDto } from '../dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dto/update-friend-request.dto';
import { logger } from 'nx/src/utils/logger';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async create(createFriendRequestDto: CreateFriendRequestDto) {
    const { senderId, recipientUsername } = createFriendRequestDto;
    if (!senderId) {
      throw new BadRequestException('senderId must be provided');
    }

    if (!recipientUsername) {
      throw new BadRequestException('recipientUsername must be provided');
    }

    // Find the recipient based on their username
    const recipient = await this.prisma.user.findUnique({
      where: { username: recipientUsername },
    });

    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    return this.prisma.friendRequest.create({
      data: {
        senderId,
        recipientId: recipient.id,
        status: 'PENDING',
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
    });
  }

  async update(id: string, dto: UpdateFriendRequestDto) {
    const { status } = dto;
    const friendRequest = await this.prisma.friendRequest.update({
      where: { id },
      data: { status },
      include: { sender: true, recipient: true },
    });

    if (status === 'ACCEPTED') {
      await this.prisma.friendship.create({
        data: {
          user1Id: friendRequest.senderId,
          user2Id: friendRequest.recipientId,
        },
      });

      return friendRequest;
    }

    return friendRequest;
  }

  async remove(id: string) {
    return this.prisma.friendRequest.delete({
      where: { id },
    });
  }
}
