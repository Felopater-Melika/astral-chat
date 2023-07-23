import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';
import { FriendRequestModule } from '../friend-request/friend-request.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { ConversationModule } from '../conversations/conversation.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        user: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    FriendRequestModule,
    FriendshipModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
