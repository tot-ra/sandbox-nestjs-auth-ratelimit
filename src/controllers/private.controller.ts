import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('private')
export class PrivateController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return 'Private hello!';
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
