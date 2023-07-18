import { FriendRequestService } from './friend-request.service';

describe('FriendRequestService_class', () => {
  // Tests that create method works with valid input
  it('test_create_valid_input', async () => {
    const prismaServiceMock = {
      friendRequest: {
        create: jest.fn(),
      },
    };
    const friendRequestService = new FriendRequestService(
      prismaServiceMock as any
    );
    const createFriendRequestDto = { senderId: '1', recipientId: '2' };
    await friendRequestService.create(createFriendRequestDto);
    expect(prismaServiceMock.friendRequest.create).toHaveBeenCalledWith({
      data: {
        senderId: '1',
        recipientId: '2',
        status: 'PENDING',
      },
    });
  });

  // Tests that findAll method works with valid input
  it('test_find_all_valid_input', async () => {
    const prismaServiceMock = {
      friendRequest: {
        findMany: jest.fn(),
      },
    };
    const friendRequestService = new FriendRequestService(
      prismaServiceMock as any
    );
    await friendRequestService.findAll('1');
    expect(prismaServiceMock.friendRequest.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ senderId: '1' }, { recipientId: '1' }],
      },
    });
  });

  // Tests that findOne method works with valid input

  // Tests that update method works with valid input
  it('test_update_valid_input', async () => {
    const prismaServiceMock = {
      friendRequest: {
        update: jest.fn(),
      },
    };
    const friendRequestService = new FriendRequestService(
      prismaServiceMock as any
    );
    const updateFriendRequestDto = { status: 'ACCEPTED' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await friendRequestService.update('1', updateFriendRequestDto);
    expect(prismaServiceMock.friendRequest.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: 'ACCEPTED' },
    });
  });

  // Tests that create method fails with missing senderId
  it('test_create_missing_sender_id', async () => {
    const prismaServiceMock = {
      friendRequest: {
        create: jest.fn(),
      },
    };
    const friendRequestService = new FriendRequestService(
      prismaServiceMock as any
    );
    const createFriendRequestDto = { recipientId: '2' };
    await expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      friendRequestService.create(createFriendRequestDto)
    ).rejects.toThrow();
  });

  // Tests that create method fails with missing recipientId
  it('test_create_missing_recipient_id', async () => {
    const prismaServiceMock = {
      friendRequest: {
        create: jest.fn(),
      },
    };
    const friendRequestService = new FriendRequestService(
      prismaServiceMock as any
    );
    const createFriendRequestDto = { senderId: '1' };
    await expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      friendRequestService.create(createFriendRequestDto)
    ).rejects.toThrow();
  });
});
