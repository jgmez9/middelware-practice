import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter.js';

describe('Reservations API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /reservations should be public', async () => {
    await request(app.getHttpServer())
      .get('/reservations')
      .expect(200)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });
  });

  it('POST /reservations should reject requests without API key', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .send({
        customerName: 'Carlos Pérez',
        email: 'carlos@email.com',
        people: 4,
      })
      .expect(403)
      .expect((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.statusCode).toBe(403);
      });
  });

  it('POST /reservations should validate the request body', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .set('x-api-key', 'restaurant-secret')
      .send({
        customerName: '',
        email: 'invalid-email',
        people: 0,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'customerName should not be empty',
            'email must be an email',
            'people must not be less than 1',
          ]),
        );
      });
  });

  it('POST /reservations should create a reservation with the correct API key', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .set('x-api-key', 'restaurant-secret')
      .send({
        customerName: 'Carlos Pérez',
        email: 'carlos@email.com',
        people: 4,
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject({
          id: 1,
          customerName: 'Carlos Pérez',
          email: 'carlos@email.com',
          people: 4,
        });
        expect(response.body.timestamp).toBeDefined();
      });
  });
});
