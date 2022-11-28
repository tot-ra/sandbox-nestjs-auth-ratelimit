import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('private')
export class PrivateController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Private hello!';
  }
}
