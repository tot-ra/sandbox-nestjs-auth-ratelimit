import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PublicController } from './controllers/public.controller';
import { PrivateController } from './controllers/private.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [PublicController, PrivateController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes('/private');
  }
}
