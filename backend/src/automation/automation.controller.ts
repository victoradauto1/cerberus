import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { PoolService } from '../pool/pool.service';
import { UserService } from '../user/user.service';
import { AutomationDTO } from './automation.dto';
import { AutomationService } from './automation.service';

@Controller('automations')
export class AutomationController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly poolService: PoolService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard)
  @Post('')
  async addAutomation(
    @Body() automation: AutomationDTO,
    @Headers('Authorization') authorization,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    const user = await this.userService.getUserById(jwt.userId);
    if (!user.privateKey)
      throw new Error(
        'You must have a private key is settings before you start a automation.',
      );

    const response = await this.automationService.addAutomation(
      jwt.userId,
      automation,
    );

    if (automation.isActive) {
      const pool = await this.poolService.getPool(automation.poolId);
      const condition = automation.isOpened
        ? automation.closeCondition
        : automation.openCondition;
      const tokenAddress = condition.field.indexOf('price0') !== -1 ? pool.token1 : pool.token0;

      //pre aprovação do swap
    }

    return response;
  }
}
