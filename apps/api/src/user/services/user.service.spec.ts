import { UserService } from '../services/user.service';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    userService = new UserService(prisma);
  });
  it('returns the correct user profile on getUser', async () => {
    const mockUser: any = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      emailVerified: true,
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
    const result = await userService.getUser('1');
    expect(result).toEqual(mockUser);
  });

  it('updates the user profile correctly on updateUser', async () => {
    const mockUser: any = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      emailVerified: true,
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
    jest.spyOn(prisma.user, 'update').mockResolvedValue(mockUser);
    const result = await userService.updateUser('1', {});
    expect(result).toEqual(mockUser);
  });

  it('deletes the user profile correctly on deleteUser', async () => {
    const mockUser: any = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      emailVerified: true,
    };
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
    jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);
    const result = await userService.deleteUser('1');
    expect(result).toEqual(mockUser);
  });

  it('throws an error if user not found on getUser', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(userService.getUser('1')).rejects.toThrow(NotFoundException);
  });

  it('throws an error if user not found on updateUser', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(userService.updateUser('1', {})).rejects.toThrow(
      NotFoundException
    );
  });

  it('throws an error if user not found on deleteUser', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(userService.deleteUser('1')).rejects.toThrow(
      NotFoundException
    );
  });
});
