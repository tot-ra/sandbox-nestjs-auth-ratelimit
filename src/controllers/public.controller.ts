import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { IpRateGuard } from '../guards/ip-rate.guard';

@Controller()
@UseGuards(IpRateGuard)
export class PublicController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
