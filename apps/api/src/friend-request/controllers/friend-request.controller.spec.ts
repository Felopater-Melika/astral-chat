import { FriendRequestController } from './friend-request.controller';
import { BadRequestException } from '@nestjs/common';

describe('FriendRequestController_class', () => {
  // Tests that create() method returns a 201 status code when valid data is provided
  it('test_create_returns_201_when_valid_data_provided', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    const mockDto = { senderId: '1', recipientId: '2' };
    const mockService = {
      create: jest.fn().mockResolvedValue({ id: '1', ...mockDto }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const controller = new FriendRequestController(mockService);
    const result = await controller.create(mockDto, mockUser);
    expect(result).toEqual({ id: '1', ...mockDto });
    expect(mockService.create).toHaveBeenCalledWith(mockDto);
  });

  // Tests that findAll() method returns an array of friend requests when valid user ID is provided
  it('test_find_all_returns_array_of_friend_requests_when_valid_user_id_provided', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    const mockService = {
      findAll: jest
        .fn()
        .mockResolvedValue([{ id: '1', senderId: '1', recipientId: '2' }]),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const controller = new FriendRequestController(mockService);
    const result = await controller.findAll('1', mockUser);
    expect(result).toEqual([{ id: '1', senderId: '1', recipientId: '2' }]);
    expect(mockService.findAll).toHaveBeenCalledWith('1');
  });

  // Tests that findOne() method returns a friend request when valid ID is provided

  // Tests that update() method returns a friend request when valid ID and update data is provided
  it('test_update_returns_friend_request_when_valid_id_and_update_data_provided', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    const mockDto = { status: 'ACCEPTED' };
    const mockService = {
      update: jest.fn().mockResolvedValue({
        id: '1',
        senderId: '1',
        recipientId: '2',
        ...mockDto,
      }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const controller = new FriendRequestController(mockService);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await controller.update('1', mockDto, mockUser);
    expect(result).toEqual({
      id: '1',
      senderId: '1',
      recipientId: '2',
      ...mockDto,
    });
    expect(mockService.update).toHaveBeenCalledWith('1', mockDto);
  });

  // Tests that remove() method returns a friend request when valid ID is provided
  it('test_remove_returns_friend_request_when_valid_id_provided', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    const mockService = {
      remove: jest
        .fn()
        .mockResolvedValue({ id: '1', senderId: '1', recipientId: '2' }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const controller = new FriendRequestController(mockService);
    const result = await controller.remove('1', mockUser);
    expect(result).toEqual({ id: '1', senderId: '1', recipientId: '2' });
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });

  // Tests that create() method throws an error when senderId is not provided
  it('test_create_throws_error_when_sender_id_not_provided', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    const mockDto = { recipientId: '2' };
    const mockService = {
      create: jest.fn().mockResolvedValue({ id: '1', ...mockDto }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const controller = new FriendRequestController(mockService);
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await controller.create(mockDto, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('senderId must be provided');
    }
  });
});
