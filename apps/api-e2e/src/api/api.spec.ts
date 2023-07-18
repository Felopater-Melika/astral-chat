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

    it('/auth/register (POST) - Second User', () => {
      return pactum
        .spec()
        .post('/auth/register')
        .withBody({
          email: 'seconduser@example.com',
          password: 'password',
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'janedoe',
        })
        .expectStatus(201);
    });

    it('/auth/login (POST) - Second User', () => {
      return pactum
        .spec()
        .post('/auth/login')
        .withBody({
          username: 'janedoe',
          password: 'password',
        })
        .expectStatus(200)
        .expectBodyContains('access_token')
        .stores('secondUserAt', 'access_token');
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
    // it('/user/profile (DELETE)', () => {
    //   return pactum
    //     .spec()
    //     .delete('/user/profile')
    //     .withHeaders({
    //       Authorization: 'Bearer $S{userAt}',
    //     })
    //     .expectStatus(200);
    // });
  });
  describe('Friend Request (e2e)', () => {
    // Test for creating a friend request
    it('/friend-request (POST)', () => {
      return pactum
        .spec()
        .post('/friend-request')
        .withBody({
          senderId: '38d99b67-aeb4-4c8a-b9ce-d6ffe99ad36b',
          recipientId: 'faaed67c-fa75-4fd9-b8b1-493fc1891fa3',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201);
    });

    // Test for getting all friend requests
    it('/friend-request (GET)', () => {
      return pactum
        .spec()
        .get('/friend-request/38d99b67-aeb4-4c8a-b9ce-d6ffe99ad36b')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    // Test for getting a specific friend request
    it('/friend-request/:id (GET)', () => {
      // Replace 'id' with the actual id of the friend request
      return pactum
        .spec()
        .get('/friend-request/38d99b67-aeb4-4c8a-b9ce-d6ffe99ad36b')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    // Test for updating a friend request
    it('/friend-request/:id (PATCH)', () => {
      // Replace 'id' with the actual id of the friend request
      return pactum
        .spec()
        .patch('/friend-request/dd053584-ac4f-4ed9-806a-b1dc4ea79929')
        .withBody({
          status: 'ACCEPTED',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    // Test for deleting a friend request
    it('/friend-request/:id (DELETE)', () => {
      // Replace 'id' with the actual id of the friend request
      return pactum
        .spec()
        .delete('/friend-request/dd053584-ac4f-4ed9-806a-b1dc4ea79929')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
  });
});
