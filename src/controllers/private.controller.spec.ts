import { Test, TestingModule } from '@nestjs/testing';
import { PrivateController } from './private.controller';

describe('PrivateController', () => {
  let controller: PrivateController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PrivateController],
    }).compile();

    controller = app.get<PrivateController>(PrivateController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Private hello!');
    });
  });
});
