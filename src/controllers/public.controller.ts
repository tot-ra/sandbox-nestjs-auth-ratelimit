import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { IpRateGuard } from '../guards/ip-rate.guard';
import { RateLimitEndpoint } from "../guards/rate-guard-endpoint-config.decorator";
import config from "../config";

@Controller()
@UseGuards(IpRateGuard)
export class PublicController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('/')
    getHello(): string {
        return `Hello! Default IP ratelimiting here (${config.IP_LIMIT_PER_HOUR} req/h). 
Try <a href="/one">one</a> <a href="/two">two</a> and <a href="/five">five</a> for custom ones`;
    }

    @Get('/one')
    @RateLimitEndpoint(5000, 500, 1)
    getOne(): string {
        return 'Hello! Only 1 req/sec here (hold CMD+R to hit it)';
    }

    @Get('/two')
    @RateLimitEndpoint(5000, 500, 2)
    getTwo(): string {
        return 'Hello! Only 2 req/sec here (hold CMD+R to hit it)';
    }

    @Get('/five')
    @RateLimitEndpoint(5000, 500, 2)
    getFive(): string {
        return 'Hello! Only 5 req/sec here (hold CMD+R to hit it)';
    }
}
