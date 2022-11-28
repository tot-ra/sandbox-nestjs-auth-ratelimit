import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

describe('PublicController', () => {
    let appController: PublicController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [AuthModule, UsersModule],
            controllers: [PublicController],
        }).compile();

        appController = app.get<PublicController>(PublicController);
    });

    it('should be defined', () => {
        expect(appController).toBeDefined();
    });

    it('should return "Hello World!"', () => {
        expect(appController.getHello()).toBe('Hello World!');
    });
});
