import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        emailVerified: true,
      },
    });

    if (!user.emailVerified) {
      await this.prisma.verificationToken.deleteMany({
        where: { userId: id },
      });
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.message.deleteMany({
      where: { senderId: id },
    });
    await this.prisma.conversationParticipant.deleteMany({
      where: { userId: id },
    });

    await this.prisma.friendRequest.deleteMany({
      where: {
        OR: [{ senderId: id }, { recipientId: id }],
      },
    });

    await this.prisma.friendship.deleteMany({
      where: {
        OR: [{ user1Id: id }, { user2Id: id }],
      },
    });

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
