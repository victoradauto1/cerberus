import { Test, TestingModule } from "@nestjs/testing";
import { PoolController } from "../../src/pool/pool.controller";
import { poolMock, poolServiceMock } from "./pool.service.mock";
import { authServiceMock } from "../../test/auth/auth.service.mock";
import { NotFoundException } from "@nestjs/common";

describe('PoolService tests', () => {
  let poolController: PoolController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [poolServiceMock , authServiceMock],
      controllers: [PoolController]
    }).compile();

    poolController = moduleFixture.get<PoolController>(PoolController);
  });

  it('should be defined', () => {
    expect(poolController).toBeDefined();
  });

   it('should get pool', async () => {
    const pool =  await poolController.getPool(poolMock.id)
    expect(pool).toBeDefined();
    expect(pool.id).toEqual(poolMock.id);
  });

  it('should NOT get pool', async () => {
    poolServiceMock.useValue.getPool.mockResolvedValue(null)
    await expect(poolController.getPool(poolMock.id)).rejects.toEqual(new NotFoundException());
  });

  it('should search pool', async () => {
    const pool =  await poolController.searchPool(poolMock.symbol, poolMock.fee);
    expect(pool).toBeDefined();
    expect(pool.id).toEqual(poolMock.id);
    expect(pool.fee).toEqual(poolMock.fee);
  });

  it('should NOT search pool', async () => {
    poolServiceMock.useValue.searchPool.mockResolvedValue(null)
    await expect(poolController.searchPool(poolMock.symbol, poolMock.fee)).rejects.toEqual(new NotFoundException());
  });

  it('should get pools', async () => {
    const pools =  await poolController.getPools(1, 1);
    expect(pools).toBeDefined();
    expect(pools.length).toEqual(1);
    expect(pools[0].id).toEqual(poolMock.id);
  });

   it('should get top pools', async () => {
    const pools =  await poolController.topPools();
    expect(pools).toBeDefined();
    expect(pools.length).toEqual(1);
    expect(pools[0].id).toEqual(poolMock.id);
  });

  it('should get symbols', async () => {
    const symbols =  await poolController.getSymbols();
    expect(symbols).toBeDefined();
    expect(symbols.length).toEqual(1);
    expect(symbols[0]).toEqual(poolMock.symbol);
  });

})