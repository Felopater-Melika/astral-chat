import {ConversationController} from "./conversation.controller";
import {BadRequestException, NotFoundException} from "@nestjs/common";

describe('ConversationController_class', () => {

  // Tests that create() method returns conversation object
  it('test_create_returns_conversation_object', async () => {
    const conversationService = {
      create: jest.fn().mockResolvedValue({ id: '123', participants: [] })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conversationController = new ConversationController(conversationService)
    const result = await conversationController.create({ participants: [] }, { id: '456' })
    expect(result).toEqual({ id: '123', participants: [] })
  })

  // Tests that findAll() method returns array of conversations
  it('test_findAll_returns_array_of_conversations', async () => {
    const conversationService = {
      findAll: jest.fn().mockResolvedValue([{ id: '123', participants: [] }])
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conversationController = new ConversationController(conversationService)
    const result = await conversationController.findAll({ id: '456' })
    expect(result).toEqual([{ id: '123', participants: [] }])
  })

  // Tests that findOne() method returns conversation object
  it('test_findOne_returns_conversation_object', async () => {
    const conversationService = {
      findOne: jest.fn().mockResolvedValue({ id: '123', participants: [] })
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conversationController = new ConversationController(conversationService)
    const result = await conversationController.findOne('123', { id: '456' })
    expect(result).toEqual({ id: '123', participants: [] })
  })

  // Tests that remove() method returns message object
  it('test_remove_returns_message_object', async () => {
    const conversationService = {
      remove: jest.fn().mockResolvedValue({ message: 'Conversation deleted successfully' })
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conversationController = new ConversationController(conversationService)
    const result = await conversationController.remove('123', { id: '456' })
    expect(result).toEqual({ message: 'Conversation deleted successfully' })
  })

  // Tests that create() method throws NotFoundException if participants array is empty
  it('test_create_throws_NotFoundException_if_participants_array_is_empty', async () => {
    const conversationService = {
      create: jest.fn().mockRejectedValue(new NotFoundException('Participants not found'))
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conversationController = new ConversationController(conversationService)
    await expect(conversationController.create({ participants: [] }, { id: '456' })).rejects.toThrow(NotFoundException)
  })

  // Tests that create() method throws BadRequestException if participants array contains duplicate user IDs
  it('test_create_throws_BadRequestException_if_participants_array_contains_duplicate_user_IDs', async () => {
    const conversationService = {
      create: jest.fn().mockRejectedValue(new BadRequestException('Participants array contains duplicate user IDs'))
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const conversationController = new ConversationController(conversationService)
    await expect(conversationController.create({ participants: ['123', '123'] }, { id: '456' })).rejects.toThrow(BadRequestException)
  })

});
