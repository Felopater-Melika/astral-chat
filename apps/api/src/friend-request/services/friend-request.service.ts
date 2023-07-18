import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFriendRequestDto } from '../dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dto/update-friend-request.dto';
import { logger } from 'nx/src/utils/logger';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async create(createFriendRequestDto: CreateFriendRequestDto) {
    const { senderId, recipientId } = createFriendRequestDto;
    if (!senderId) {
      throw new BadRequestException('senderId must be provided');
    }

    if (!recipientId) {
      throw new BadRequestException('recipientId must be provided');
    }
    return this.prisma.friendRequest.create({
      data: {
        senderId,
        recipientId,
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
