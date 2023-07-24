import { MessageService } from '../services/message.service';
import { MessageController } from './message.controller';
import { NotFoundException } from '@nestjs/common';

describe('MessageController_class', () => {
  // Tests that create method returns a message object
  it('test_create_returns_message_object', async () => {
    // Arrange
    const createMessageDto = {
      senderId: '1',
      conversationId: '1',
      body: 'test',
    };
    const user = { id: '1' };
    const message = {
      id: '1',
      body: 'test',
      senderId: '1',
      conversationId: '1',
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const messageService = new MessageService();
    const messageController = new MessageController(messageService);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(messageService, 'create').mockResolvedValueOnce(message);

    // Act
    const result = await messageController.create(createMessageDto, user);

    // Assert
    expect(result).toBe(message);
    expect(messageService.create).toHaveBeenCalledWith(
      createMessageDto,
      user.id
    );
  });

  // Tests that findAll method returns an array of message objects
  it('test_find_all_returns_array_of_message_objects', async () => {
    // Arrange
    const user = { id: '1' };
    const messages = [
      { id: '1', body: 'test', senderId: '1', conversationId: '1' },
    ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const messageService = new MessageService();
    const messageController = new MessageController(messageService);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(messageService, 'findAll').mockResolvedValueOnce(messages);

    // Act
    const result = await messageController.findAll('1', user);

    // Assert
    expect(result).toBe(messages);
    expect(messageService.findAll).toHaveBeenCalledWith('1', user.id);
    expect(messageService.findAll).toHaveBeenCalledTimes(1);
  });

  // Tests that create method throws a NotFoundException if conversation is not found
  it('test_create_throws_NotFoundException_if_conversation_not_found', async () => {
    // Arrange
    const createMessageDto = {
      senderId: '1',
      conversationId: '1',
      body: 'test',
    };
    const user = { id: '1' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const messageService = new MessageService();
    const messageController = new MessageController(messageService);
    jest
      .spyOn(messageService, 'create')
      .mockRejectedValueOnce(new NotFoundException());

    // Act and Assert
    await expect(
      messageController.create(createMessageDto, user)
    ).rejects.toThrow(NotFoundException);

    // Verify that the mock was called with the correct parameters
    expect(messageService.create).toHaveBeenCalledWith(
      createMessageDto,
      user.id
    );
  });
});
