import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: true,
        user2: true,
      },
    });

    return friendships.map((friendship) => {
      return friendship.user1Id === userId
        ? friendship.user2
        : friendship.user1;
    });
  }

  async remove(id: string, userId: string) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    if (
      !friendship ||
      (friendship.user1Id !== userId && friendship.user2Id !== userId)
    ) {
      throw new UnauthorizedException();
    }

    return this.prisma.friendship.delete({
      where: { id },
    });
  }
}
