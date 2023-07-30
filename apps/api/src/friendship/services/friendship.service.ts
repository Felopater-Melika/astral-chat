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
      return {
        id: friendship.id,
        friend:
          friendship.user1Id === userId ? friendship.user2 : friendship.user1,
      };
    });
  }

  async remove(id: string) {
    return this.prisma.friendship.delete({
      where: { id },
    });
  }
}
