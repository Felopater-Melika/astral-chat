import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFriendRequestDto } from '../dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dto/update-friend-request.dto';

@Injectable()
export class FriendRequestService {
  constructor(private prisma: PrismaService) {}

  async create(createFriendRequestDto: CreateFriendRequestDto) {
    console.log(
      'daskl;hghas;kldfjas;kldf;lkajsdf;ljkadfk;ljs' +
        createFriendRequestDto.senderId
    );
    const { senderId, recipientId } = createFriendRequestDto;
    // if (!senderId) {
    //   throw new BadRequestException('senderId must be provided');
    // }
    //
    // if (!recipientId) {
    //   throw new BadRequestException('recipientId must be provided');
    // }
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

  async findOne(id: string) {
    return this.prisma.friendRequest.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateFriendRequestDto: UpdateFriendRequestDto) {
    const { status } = updateFriendRequestDto;
    return this.prisma.friendRequest.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.friendRequest.delete({
      where: { id },
    });
  }
}
