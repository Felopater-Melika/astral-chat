import { MessageService } from './message.service';
import { NotFoundException } from '@nestjs/common';

describe('MessageService_class', () => {
  // Tests that a message can be created with valid conversationId and body
  it('test_create_message_valid', async () => {
    const prismaService = {
      conversation: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ participants: [{ userId: '1' }] }),
      },
      message: {
        create: jest.fn().mockResolvedValue({ id: '1' }),
        findMany: jest.fn().mockResolvedValue([{ id: '1' }]),
      },
    };
    const messageService = new MessageService(prismaService as any);
    const createMessageDto = {
      conversationId: '1',
      body: 'test',
      senderId: '1',
    };
    const result = await messageService.create(createMessageDto, '1');
    expect(prismaService.conversation.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { participants: true },
    });
    expect(prismaService.message.create).toHaveBeenCalledWith({
      data: { body: 'test', senderId: '1', conversationId: '1' },
    });
    expect(result).toEqual({ id: '1' });
  });

  // Tests that all messages for a user can be found
  it('test_find_all_messages_for_user', async () => {
    const userId = '1';
    const prismaService = {
      message: {
        findMany: jest.fn().mockResolvedValue([{ id: '1' }]),
      },
      conversation: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: '1', participants: [{ userId }] }),
      },
    };
    const messageService = new MessageService(prismaService as any);
    const result = await messageService.findAll('1', userId);
    expect(prismaService.message.findMany).toHaveBeenCalledWith({
      where: { conversationId: '1' },
      include: { conversation: true },
    });
    expect(result).toEqual([{ id: '1' }]);
  });

  // Tests that NotFoundException is thrown when conversation is not found
  it('test_throw_not_found_exception', async () => {
    const prismaService = {
      conversation: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const messageService = new MessageService(prismaService as any);
    const createMessageDto = { conversationId: '1', body: 'test' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(messageService.create(createMessageDto, '1')).rejects.toThrow(
      NotFoundException
    );
  });
});
