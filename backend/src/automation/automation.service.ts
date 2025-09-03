import { Body, Headers, Injectable, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AutomationDTO } from './automation.dto';

@Injectable()
export class AutomationService {
  @UseGuards(AuthGuard)
  @Post('')
  async addAutomation(
    @Body() automation: AutomationDTO,
    @Headers('Authorization') authorization,
  ) {}
}
