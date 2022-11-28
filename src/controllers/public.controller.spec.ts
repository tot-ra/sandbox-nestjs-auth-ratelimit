import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { AppService } from '../app.service';

describe('AppController', () => {
  let appController: PublicController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [AppService],
    }).compile();

    appController = app.get<PublicController>(PublicController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
