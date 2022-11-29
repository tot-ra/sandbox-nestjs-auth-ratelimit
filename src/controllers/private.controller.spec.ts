import { Test, TestingModule } from '@nestjs/testing';
import { PrivateController } from './private.controller';
import { IpRateGuard } from '../guards/ip-rate.guard';
import { TokenRateGuard } from '../guards/token-rate.guard';
import { CanActivate } from '@nestjs/common';

describe('PrivateController', () => {
  let controller: PrivateController;

  beforeEach(async () => {
    const mock_TokenRateGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PrivateController],
    })
      .overrideGuard(TokenRateGuard)
      .useValue(mock_TokenRateGuard)
      .compile();

    controller = app.get<PrivateController>(PrivateController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Private hello!');
    });
  });
});
