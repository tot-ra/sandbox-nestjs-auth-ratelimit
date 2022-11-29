import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TokenRateGuard } from "../guards/token-rate.guard";

@UseGuards(TokenRateGuard)
@UseGuards(JwtAuthGuard)
@Controller('private')
export class PrivateController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Private hello!';
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
