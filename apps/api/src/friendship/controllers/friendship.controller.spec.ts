import { FriendshipController } from './friendship.controller';
import { UnauthorizedException } from '@nestjs/common';

describe('FriendshipController_class', () => {
  // Tests that the findAll method returns an array of friendships
  it('test_find_all_returns_array', async () => {
    const friendshipService = {
      findAll: jest.fn().mockResolvedValue([
        { id: '1', name: 'friend1' },
        { id: '2', name: 'friend2' },
      ]),
      remove: jest.fn().mockResolvedValue({ id: '1', name: 'friend1' }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const friendshipController = new FriendshipController(friendshipService);
    const user = { id: '1', username: 'user1' };
    const result = await friendshipController.findAll(user);
    expect(result).toEqual([
      { id: '1', name: 'friend1' },
      { id: '2', name: 'friend2' },
    ]);
    expect(friendshipService.findAll).toHaveBeenCalledWith('1');
  });

  // Tests that the remove method returns the deleted friendship
  it('test_remove_returns_deleted_friendship', async () => {
    const friendshipService = {
      findAll: jest.fn().mockResolvedValue([
        { id: '1', name: 'friend1' },
        { id: '2', name: 'friend2' },
      ]),
      remove: jest.fn().mockResolvedValue({ id: '1', name: 'friend1' }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const friendshipController = new FriendshipController(friendshipService);
    const user = { id: '1', username: 'user1' };
    const result = await friendshipController.remove('1', user);
    expect(result).toEqual({ id: '1', name: 'friend1' });
    expect(friendshipService.remove).toHaveBeenCalledWith('1', '1');
  });

  // Tests that the remove method throws an UnauthorizedException when friendship not found or user is not part of the friendship
  it('test_remove_throws_unauthorized_exception', async () => {
    const friendshipService = {
      findAll: jest.fn().mockResolvedValue([
        { id: '1', name: 'friend1' },
        { id: '2', name: 'friend2' },
      ]),
      remove: jest.fn().mockRejectedValue(new UnauthorizedException()),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const friendshipController = new FriendshipController(friendshipService);
    const user = { id: '3', username: 'user3' };
    await expect(friendshipController.remove('1', user)).rejects.toThrow(
      UnauthorizedException
    );
    expect(friendshipService.remove).toHaveBeenCalled();
  });
});
