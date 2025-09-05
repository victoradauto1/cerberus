import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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

    if (automation.isActive && automation.poolId) {
      const pool = await this.poolService.getPool(automation.poolId);
      const condition = automation.isOpened
        ? automation.closeCondition
        : automation.openCondition;
      if (!condition) return response;
      const tokenAddress =
        condition.field.indexOf('price0') !== -1 ? pool.token1 : pool.token0;

      //pre aprovação do swap
    }

    return response;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateAutomation(
    @Param('id') id: string,
    @Body() automation: AutomationDTO,
    @Headers('Authorization') authorization: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    const user = await this.userService.getUserById(jwt.userId);
    if (!user.privateKey)
      throw new Error(
        'You must have a private key is settings before you update a automation.',
      );

    const automationResult = await this.automationService.updateAutomation(
      id,
      jwt.userId,
      automation,
    );

    if (!automationResult.poolId || !automationResult.isActive)
      return automationResult;

    const condition = automation.isOpened
      ? automation.closeCondition
      : automation.openCondition;

    if (!condition) return automationResult;

    const pool = await this.poolService.getPool(automation.poolId);
    const tokenAddress =
      condition.field.indexOf('price0') !== -1 ? pool.token1 : pool.token0;

    //pegar a allownce
    //pre aprovação do swap
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAutomation(@Param("id") id: string,@Headers('Authorization') authorization: string ){
     const jwt = this.authService.decodeToken(authorization);
     return this.automationService.getAutomation(id, jwt.userId);
  }
}
