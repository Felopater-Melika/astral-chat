import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';

jest.mock('../../auth/guards/auth.guard');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    (JwtAuthGuard as jest.Mock).mockImplementation(() => ({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = { id: '1' }; // Set the user to a non-null value
        return true;
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn().mockResolvedValue({ id: '1' }),
            updateUser: jest.fn().mockResolvedValue({ id: '1' }),
            deleteUser: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should return user profile on getProfile', async () => {
    const user = { id: '1' };
    const result = await userController.getProfile(user);
    expect(userService.getUser).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should update user profile on updateUser', async () => {
    const user = { id: '1' };
    const dto = { firstName: 'John', lastName: 'Doe' };
    const result = await userController.updateUser(dto, user);
    expect(userService.updateUser).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual({ id: '1' });
  });

  it('should delete user profile on deleteUser', async () => {
    const user = { id: '1' };
    const result = await userController.deleteUser(user);
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });
});
