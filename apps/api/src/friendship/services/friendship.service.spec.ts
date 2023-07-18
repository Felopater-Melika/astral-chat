import { FriendshipService } from './friendship.service';

describe('FriendshipService_class', () => {
  // Tests that the findAll method returns an array of friendships
  it('test_find_all_returns_array', async () => {
    const prismaService = {
      friendship: {
        findMany: jest
          .fn()
          .mockResolvedValue([{ user1Id: '1', user2: { id: '2' } }]),
      },
    };
    const friendshipService = new FriendshipService(prismaService as any);
    const result = await friendshipService.findAll('1');
    expect(result).toEqual([{ id: '2' }]);
  });

  // Tests that the findAll method returns an empty array if no friendships found
  it('test_find_all_returns_empty_array', async () => {
    const prismaService = {
      friendship: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const friendshipService = new FriendshipService(prismaService as any);
    const result = await friendshipService.findAll('1');
    expect(result).toEqual([]);
  });

  // Tests that the remove method deletes a friendship if it belongs to the user
  it('test_remove_deletes_friendship', async () => {
    const prismaService = {
      friendship: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: '1', user1Id: '1', user2Id: '2' }),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
      },
    };
    const friendshipService = new FriendshipService(prismaService as any);
    const result = await friendshipService.remove('1', '1');
    expect(prismaService.friendship.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual({ id: '1' });
  });
});
