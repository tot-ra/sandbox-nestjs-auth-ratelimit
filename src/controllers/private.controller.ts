import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TokenRateGuard } from '../guards/token-rate.guard';
import { RateLimitEndpoint } from '../guards/rate-guard-endpoint-config.decorator';

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

  @Get('/one')
  @RateLimitEndpoint(5000, 500, 1)
  getOne(): string {
    return 'Hello! Only 1 req/sec here';
  }
}
