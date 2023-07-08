import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppModule } from '../../../api/src/app/app.module';
import { PrismaService } from 'nestjs-prisma';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Api (e2e)', () => {
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
  describe('Auth (e2e)', () => {
    it('/auth/register (POST)', () => {
      return pactum
        .spec()
        .post('/auth/register')
        .withBody({
          email: 'tessghtfedt@example.com',
          password: 'password',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        })
        .expectStatus(201);
    });

    it('/auth/login (POST)', () => {
      return pactum
        .spec()
        .post('/auth/login')
        .withBody({
          username: 'johndoe',
          password: 'password',
        })
        .expectStatus(200)
        .expectBodyContains('access_token')
        .stores('userAt', 'access_token');
    });
  });

  describe('User (e2e)', () => {
    it('/user/profile (GET)', () => {
      return pactum
        .spec()
        .get('/user/profile')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    it('/user/profile (PUT)', () => {
      return pactum
        .spec()
        .put('/user/profile')
        .withBody({
          username: 'johndoe',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
    it('/user/profile (DELETE)', () => {
      return pactum
        .spec()
        .delete('/user/profile')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
  });
});
