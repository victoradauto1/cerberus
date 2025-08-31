import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PoolService } from './pool.service';

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @UseGuards(AuthGuard)
  @Get('symbols')
  async getSymbols() {
    return this.poolService.getPoolSymbols();
  }

  @UseGuards(AuthGuard)
  @Get('top')
  async topPools() {
    return this.poolService.getTopPools();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getPool(@Param('id') id: string) {
    const pool = await this.poolService.getPool(id);
    if (!pool) throw new NotFoundException();
    return pool;
  }

  @UseGuards(AuthGuard)
  @Get('search/:symbol/')
  async searchPool(
    @Param('symbol') symbol: string,
  ) {
    const pools = await this.poolService.searchPool(symbol);
    if (!pools) throw new NotFoundException();

    return pools;
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPools(
    @Query('page', ParseIntPipe) page: number,
    @Query('PageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.poolService.getPools(page, pageSize);
  }
}
