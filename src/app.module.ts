import { Module } from '@nestjs/common';

import { AuthModule } from './services/auth/auth.module';
import { UsersModule } from './services/users/users.module';

import { PublicController } from "./controllers/public.controller";
import { PrivateController } from "./controllers/private.controller";
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        RedisModule.forRoot({
            config: {
                host: process.env.REDIS_HOST,
                port: 6379,
            }
        })
    ],
    controllers: [PublicController, PrivateController]
})
export class AppModule {
}
