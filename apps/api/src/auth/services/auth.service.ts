import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'nestjs-prisma';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailer: MailerService
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await argon2.hash(dto.password);

    delete dto.password;
    const user = await this.prisma.user.create({
      data: { ...dto, hashedPassword, emailVerified: false },
      select: { id: true, username: true },
    });

    const verificationToken = await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(), // Generate a random token
        expires: new Date(Date.now() + 60 * 60 * 1000), // Token expires after 1 hour
      },
    });

    this.mailer
      .sendMail({
        to: dto.email,
        subject: 'Verify your email address',
        html: `<a href="http://192.168.0.82:3000/api/auth/verify/${verificationToken.token}">Verify your email address</a>`,
      })
      .then(() => {
        Logger.log('Email sent');
      })
      .catch((err) => {
        Logger.log(err);
      });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async login(dto: LoginDto) {
    console.log(dto)
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await argon2.verify(user.hashedPassword, dto.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        username: user.username,
      }),
    };
  }

  async verifyEmail(token: string) {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      throw new UnauthorizedException('Verification token is invalid.');
    }

    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });
    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { message: 'Email successfully verified' };
  }
}
