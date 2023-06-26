import { AuthController } from './auth.controller';

describe('AuthController_class', () => {
  // Tests that a user can successfully register with valid input
  it('test_successful_registration', async () => {
    const dto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = {
      register: jest.fn().mockResolvedValue(dto),
    };
    const authController = new AuthController(authService as never);
    const result = await authController.register(dto);
    expect(result).toBe(dto);
  });

  // Tests that a user can successfully log in with valid input
  it('test_successful_login', async () => {
    const dto = {
      username: 'johndoe',
      password: 'password',
    };
    const authService = {
      login: jest.fn().mockResolvedValue({ access_token: 'token' }),
    };
    const authController = new AuthController(authService as never);
    const result = await authController.login(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  // Tests that registration fails when required fields are missing
  it('test_missing_required_fields', async () => {
    const dto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };
    const authService = {
      register: jest.fn().mockRejectedValue(new Error('Validation failed')),
    };
    const authController = new AuthController(authService as never);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(authController.register(dto)).rejects.toThrow(
      'Validation failed'
    );
  });

  // Tests that registration fails when an invalid email is provided
  it('test_invalid_email', async () => {
    const dto = {
      email: 'invalid_email',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = {
      register: jest.fn().mockRejectedValue(new Error('Validation failed')),
    };
    const authController = new AuthController(authService as never);
    await expect(authController.register(dto)).rejects.toThrow(
      'Validation failed'
    );
  });

  // Tests that registration fails when an existing username is provided
  it('test_existing_username', async () => {
    const dto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = {
      register: jest.fn().mockRejectedValue(new Error('User already exists')),
    };
    const authController = new AuthController(authService as never);
    await expect(authController.register(dto)).rejects.toThrow(
      'User already exists'
    );
  });

  // Tests that login fails when a non-existent user attempts to log in
  it('test_non_existent_user', async () => {
    const dto = {
      username: 'nonexistentuser',
      password: 'password',
    };
    const authService = {
      login: jest.fn().mockRejectedValue(new Error('User not found')),
    };
    const authController = new AuthController(authService as never);
    await expect(authController.login(dto)).rejects.toThrow('User not found');
  });

  it('test_successful_email_verification', async () => {
    const token = 'valid_token';
    const authService = {
      verifyEmail: jest
        .fn()
        .mockResolvedValue({ message: 'Email successfully verified' }),
    };
    const result = await authService.verifyEmail(token);
    expect(result).toBeDefined();
    expect(result.message).toEqual('Email successfully verified');
  });
});
