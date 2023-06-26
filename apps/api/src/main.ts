/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { ValidationPipe } from '@nestjs/common';
import { logger } from 'nx/src/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  const port = process.env.PORT || 3000;
  logger.info(`Listening at http://localhost:${port}/${globalPrefix}`);
  await app.listen(port);
}

bootstrap();
