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
          email: 'test1@example.com',
          password: 'password',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        })
        .expectStatus(201)
        .expectBodyContains('id')
        .stores('user1Id', 'id');
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
          email: 'test2@example.com',
          password: 'password',
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'janedoe',
        })
        .expectStatus(201)
        .expectBodyContains('id')
        .stores('user2Id', 'id');
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

    it('/auth/register (POST) - Delete User', () => {
      return pactum
        .spec()
        .post('/auth/register')
        .withBody({
          email: 'delete@example.com',
          password: 'password',
          firstName: 'Delete',
          lastName: 'Doe',
          username: 'deleteDoe',
        })
        .expectStatus(201);
    });
    it('/auth/login (POST) - Delete User', () => {
      return pactum
        .spec()
        .post('/auth/login')
        .withBody({
          username: 'deleteDoe',
          password: 'password',
        })
        .expectStatus(200)
        .expectBodyContains('access_token')
        .stores('deleteUserAt', 'access_token');
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
          Authorization: 'Bearer $S{deleteUserAt}',
        })
        .expectStatus(200);
    });
  });
  describe('Friend Request (e2e)', () => {
    // Test for creating a friend request
    it('/friend-request (POST)', () => {
      return pactum
        .spec()
        .post('/friend-request')
        .withBody({
          senderId: '$S{user1Id}',
          recipientId: '$S{user2Id}',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201)
        .expectBodyContains('id')
        .stores('friendRequestIdDelete', 'id');
    });
    // Test for deleting a friend request
    it('/friend-request/:id (DELETE)', () => {
      return pactum
        .spec()
        .delete('/friend-request/$S{friendRequestIdDelete}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
    // Test for creating a friend request
    it('/friend-request (POST)', () => {
      return pactum
        .spec()
        .post('/friend-request')
        .withBody({
          senderId: '$S{user1Id}',
          recipientId: '$S{user2Id}',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201)
        .expectBodyContains('id')
        .stores('friendRequestId', 'id');
    });
    // Test for getting all friend requests
    it('/friend-request (GET)', () => {
      return pactum
        .spec()
        .get('/friend-request/$S{user1Id}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
    // Test for updating a friend request
    it('/friend-request/:id (PATCH)', () => {
      return pactum
        .spec()
        .patch('/friend-request/$S{friendRequestId}')
        .withBody({
          status: 'ACCEPTED',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
  });
  describe('FriendShip  (e2e)', () => {
    // Test for getting all friendships
    it('/friendship (GET)', () => {
      return pactum
        .spec()
        .get('/friendship')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains('id')
        .stores('friendshipId', 'id');
    });

    // Test for deleting a friendship
    it('/friendship/:id (DELETE)', () => {
      return pactum
        .spec()
        .delete('/friendship/$S{friendshipId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
  });
  describe('Conversation (e2e)', () => {
    // Test for creating a conversation
    it('/conversation (POST)', () => {
      return pactum
        .spec()
        .post('/conversation')
        .withBody({
          participants: ['$S{user1Id}', '$S{user2Id}'],
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201)
        .expectBodyContains('id')
        .stores('conversationId', 'id');
    });

    // Test for getting all conversations for a user
    it('/conversation (GET)', () => {
      return pactum
        .spec()
        .get('/conversation')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    // Test for getting a specific conversation
    it('/conversation/:id (GET)', () => {
      return pactum
        .spec()
        .get('/conversation/$S{conversationId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    // Test for deleting a conversation
    it('/conversation/:id (DELETE)', () => {
      return pactum
        .spec()
        .delete('/conversation/$S{conversationId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
  });

  describe('Message (e2e)', () => {
    // Test for creating a message
    it('/message (POST)', () => {
      return pactum
        .spec()
        .post('/message')
        .withBody({
          senderId: '$S{user1Id}',
          conversationId: '$S{conversationId}',
          body: 'Hello, world!',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201)
        .expectBodyContains('id')
        .stores('messageId', 'id');
    });

    // Test for getting all messages for a specific conversation
    it('/message (GET)', () => {
      return pactum
        .spec()
        .get('/message')
        .withQueryParams({
          conversationId: '$S{conversationId}',
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });
  });
});
