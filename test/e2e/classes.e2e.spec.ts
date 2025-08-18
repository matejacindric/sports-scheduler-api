import { AppModule } from '@/app.module';
import { LoginResponse } from '@/common/types/jwt.type';
import { DatabaseService } from '@/core/database/database.service';
import { classes, sports, users } from '@/core/database/schema';
import { seedSportsAndClasses } from '@/core/database/seed/sports-and-classes.seed';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';

describe('Classes', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    databaseService = app.get(DatabaseService);
  });

  beforeEach(async () => {
    await seedSportsAndClasses(databaseService.db);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
    const body = loginRes.body as LoginResponse;
    jwtToken = body.access_token;
  });

  afterEach(async () => {
    await databaseService.db.delete(users);
    await databaseService.db.delete(classes);
    await databaseService.db.delete(sports);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /classes?sports=Basketball', () => {
    it('should return filtered classes', async () => {
      const response = await request(app.getHttpServer())
        .get('/classes?sports=basketball')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: 'Intermediate basketball skills and drills',
          }),
        ]),
      );
    });
  });

  describe('GET /classes/:id', () => {
    it('should return class details', async () => {
      const all = await request(app.getHttpServer())
        .get('/classes')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
      const first = all.body[0];

      const response = await request(app.getHttpServer())
        .get(`/classes/${first.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: first.id,
        description: expect.any(String),
        classDays: expect.any(Array),
      });
    });

    it('should return 404 if class not found', async () => {
      const nonExistentId = randomUUID();
      const response = await request(app.getHttpServer())
        .get(`/classes/${nonExistentId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: `Class with id ${nonExistentId} not found`,
        error: 'Not Found',
      });
    });
  });
});
