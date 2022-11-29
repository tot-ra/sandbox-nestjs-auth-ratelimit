import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { AuthModule } from '../services/auth/auth.module';
import { UsersModule } from '../services/users/users.module';
import { IPGuard } from '../guards/ip.guard';
import { CanActivate } from "@nestjs/common";

describe('PublicController', () => {
    let appController: PublicController;

    beforeEach(async () => {
        const mock_IPGuard: CanActivate = { canActivate: jest.fn(() => true) };
        const app: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, UsersModule],
            controllers: [PublicController],
        }).overrideGuard(IPGuard)
            .useValue(mock_IPGuard)
            .compile();

        appController = app.get<PublicController>(PublicController);
    });

    it('should be defined', () => {
        expect(appController).toBeDefined();
    });

    it('should return "Hello World!"', () => {
        expect(appController.getHello()).toBe('Hello World!');
    });
});
