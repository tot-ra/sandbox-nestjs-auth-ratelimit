import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/ (GET)', (done) => {
    request(app.getHttpServer())
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.text).toContain('Hello');
        done();
      });
  });

  describe('ratelimiting', () => {
    it('/ (GET)', async () => {
      const server = app.getHttpServer();
      const agent = request(server);
      const requests = [];

      for (let i = 0; i < 100; i++) {
        requests.push(agent.get('/'));
      }
      const result = await Promise.all(requests);

      let rateLimitedRequests = 0;
      for (const response of result) {
        if (response.statusCode === 429) {
          rateLimitedRequests++;
        }
      }

      console.log(`ratelimited ${rateLimitedRequests} requests`);
      expect(rateLimitedRequests).toBeGreaterThan(70); // assume worst case, 3 sec for all requests, 10 calls per sec allowed
    });
  });
});
