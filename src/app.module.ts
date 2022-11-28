import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { PublicController } from "./controllers/public.controller";
import { PrivateController } from "./controllers/private.controller";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [PublicController, PrivateController]
})
export class AppModule {}
