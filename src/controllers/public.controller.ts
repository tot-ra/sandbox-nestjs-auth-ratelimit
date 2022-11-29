import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { IPGuard } from '../guards/ip.guard';

@Controller()
export class PublicController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(IPGuard)
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
