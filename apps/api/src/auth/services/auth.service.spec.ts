import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

const mockMailerService = {
  sendMail: jest.fn().mockImplementation((mailOptions) => {
    return new Promise((resolve, reject) => {
      resolve('Email sent');
    });
  }),
};

describe('AuthService_class', () => {
  // Tests that a user can successfully register
  it('test_successful_registration', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = new AuthService(
      new JwtService({}),
      new PrismaService(),
      mockMailerService as never
    );
    const user = await authService.register(dto);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
  });

  // Tests that a user can log in successfully
  it('test_successful_login', async () => {
    const dto = {
      username: 'johndoe',
      password: 'password',
    };
    const authService = new AuthService(
      new JwtService({ secret: 'secret' }),
      new PrismaService(),
      mockMailerService as never
    );
    const result = await authService.login(dto);
    expect(result).toHaveProperty('access_token');
  });

  // Tests that registration fails when required fields are missing
  it('test_registration_missing_fields', async () => {
    const dto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = new AuthService(
      new JwtService({}),
      new PrismaService(),
      mockMailerService as never
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(authService.register(dto)).rejects.toThrow();
  });

  // Tests that registration fails when an invalid email is provided
  it('test_registration_invalid_email', async () => {
    const dto = {
      email: 'invalid-email',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = new AuthService(
      new JwtService({}),
      new PrismaService(),
      mockMailerService as never
    );
    await expect(authService.register(dto)).rejects.toThrow();
  });

  // Tests that registration fails when an existing username is provided
  it('test_registration_existing_username', async () => {
    const dto2 = {
      email: 'test2@example.com',
      password: 'password',
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'johndoe',
    };
    const authService = new AuthService(
      new JwtService({}),
      new PrismaService(),
      mockMailerService as never
    );
    await expect(authService.register(dto2)).rejects.toThrow();
  });

  // Tests that login fails when required fields are missing
  it('test_login_missing_fields', async () => {
    const dto = {
      username: 'johndoe',
    };
    const authService = new AuthService(
      new JwtService({}),
      new PrismaService(),
      mockMailerService as never
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(authService.login(dto)).rejects.toThrow();
  });

  it('should verify email with valid token', async () => {
    const verificationToken = { id: 1, token: 'valid_token', userId: 1 };
    const user = { id: 1, emailVerified: false };
    const prismaService = {
      verificationToken: {
        findUnique: jest.fn().mockResolvedValue(verificationToken),
        delete: jest.fn().mockResolvedValue(verificationToken),
      },
      user: {
        update: jest.fn().mockResolvedValue(user),
      },
    };
    const authService = new AuthService(
      {} as never,
      prismaService as never,
      mockMailerService as never
    );

    await authService.verifyEmail('valid_token');

    expect(prismaService.verificationToken.findUnique).toHaveBeenCalledWith({
      where: { token: 'valid_token' },
    });
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { emailVerified: true },
    });
    expect(prismaService.verificationToken.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
