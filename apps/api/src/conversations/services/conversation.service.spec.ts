import {ConversationService} from "./conversation.service";

describe('ConversationService_class', () => {

  // Tests that create method creates a conversation with correct data
  it('test_create_conversation_with_correct_data', async () => {
    const mockPrismaService = {
      conversation: {
        create: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        delete: jest.fn().mockResolvedValue({}),
      },
    };
    const conversationService = new ConversationService(mockPrismaService as any);
    const createConversationDto = { participants: ['1', '2'] };
    const userId = '1';
    const conversation = await conversationService.create(createConversationDto, userId);
    expect(conversation).toBeDefined();
    expect(conversation.id).toBeDefined();
    // expect(conversation.participants).toBeDefined();
    expect(mockPrismaService.conversation.create).toHaveBeenCalledWith({
      data: {
        participants: {
          create: [
            { userId: '1', hasSeenLatestMessage: false },
            { userId: '2', hasSeenLatestMessage: false },
          ],
        },
      },
    });
  });

  // Tests that findAll method returns all conversations for a user
  it('test_find_all_conversations_for_user', async () => {
    const mockPrismaService = {
      conversation: {
        create: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        findMany: jest.fn().mockResolvedValue([{ id: '1', participants: [] }]),
        findUnique: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        delete: jest.fn().mockResolvedValue({}),
      },
    };
    const conversationService = new ConversationService(mockPrismaService as any);
    const userId = '1';
    const conversations = await conversationService.findAll(userId);
    expect(conversations).toBeDefined();
    expect(conversations.length).toBeGreaterThan(0);
    expect(mockPrismaService.conversation.findMany).toHaveBeenCalledWith({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  });

  // Tests that findOne method returns a conversation for a user
  it('test_find_one_conversation_for_user', async () => {
    const mockPrismaService = {
      conversation: {
        create: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        findMany: jest.fn().mockResolvedValue([{ id: '1', participants: [] }]),
        findUnique: jest.fn().mockResolvedValue({ id: '1', participants: [{ userId: '1' }] }),  // Include the user's ID in the participants
        delete: jest.fn().mockResolvedValue({ message: 'Conversation deleted' }),
      },
    };

    const conversationService = new ConversationService(mockPrismaService as any);
    const id = '1';
    const userId = '1';
    const conversation = await conversationService.findOne(id, userId);
    expect(conversation).toBeDefined();
    expect(conversation.id).toBeDefined();
    expect(conversation.participants).toBeDefined();
    expect(mockPrismaService.conversation.findUnique).toHaveBeenCalledWith({
      where: { id },
      include: {
        participants: true,
        messages: true,
      },
    });
  });

  // Tests that remove method removes a conversation for a user
  it('test_remove_conversation_for_user', async () => {
    const mockPrismaService = {
      conversation: {
        create: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        findMany: jest.fn().mockResolvedValue([{ id: '1', participants: [] }]),
        findUnique: jest.fn().mockResolvedValue({
          id: '1',
          participants: [{ userId: '1' }] // Mock the user as a participant
        }),
        delete: jest.fn().mockResolvedValue({}),
      },
    };
    const conversationService = new ConversationService(mockPrismaService as any);
    const id = '1';
    const userId = '1';
    const result = await conversationService.remove(id, userId);
    expect(result).toBeDefined();
    expect(result.message).toBeDefined();
    expect(mockPrismaService.conversation.delete).toHaveBeenCalledWith({ where: { id } });
  });



  // Tests that create method throws an error if participants array is empty
  it('test_create_method_throws_error_if_participants_array_is_empty', async () => {
    const mockPrismaService = {
      conversation: {
        create: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        delete: jest.fn().mockResolvedValue({}),
      },
    };
    const conversationService = new ConversationService(mockPrismaService as any);
    const createConversationDto = { participants: [] };
    const userId = '1';
    await expect(conversationService.create(createConversationDto, userId)).rejects.toThrow();
  });

  // Tests that create method throws an error if participants array contains duplicate user ids
  it('test_create_method_throws_error_if_participants_array_contains_duplicate_user_ids', async () => {
    const mockPrismaService = {
      conversation: {
        create: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ id: '1', participants: [] }),
        delete: jest.fn().mockResolvedValue({}),
      },
    };
    const conversationService = new ConversationService(mockPrismaService as any);
    const createConversationDto = { participants: ['1', '1'] };
    const userId = '1';
    await expect(conversationService.create(createConversationDto, userId)).rejects.toThrow();
  });

});
