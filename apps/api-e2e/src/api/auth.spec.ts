import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppModule } from '../../../api/src/app/app.module';
import { PrismaService } from 'nestjs-prisma';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  it('/auth/register (POST)', () => {
    return pactum
      .spec()
      .post('/auth/register')
      .withBody({
        email: 'tessghtfedt@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johfgasdndoe',
      })
      .expectStatus(201);
  });

  it('/auth/login (POST)', () => {
    return pactum
      .spec()
      .get('/auth/login')
      .withBody({
        username: 'johndoe',
        password: 'password',
      })
      .expectStatus(200)
      .expectBodyContains('access_token');
  });
});
