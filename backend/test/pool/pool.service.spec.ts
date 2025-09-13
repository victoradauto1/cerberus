import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { pools } from 'commons/data';
import { JsonObject } from 'commons/data/runtime/library';
import { PoolService } from '../../src/pool/pool.service';
import { prismaMock } from '../../test/db.mock';
import { poolMock } from './pool.service.mock';

describe('PoolService tests', () => {
  let poolService: PoolService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [PoolService],
    }).compile();

    poolService = moduleFixture.get<PoolService>(PoolService);
  });

  it('should be defined', () => {
    expect(poolService).toBeDefined();
  });

  // getPool
  it('should get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue({ ...poolMock } as pools);

    const result = await poolService.getPool(poolMock.id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(poolMock.id);
  });

  it('should NOT get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue(null);

    await expect(poolService.getPool(poolMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  // searchPool
  it('should search pool', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock }] as pools[]);

    const result = await poolService.searchPool(poolMock.symbol);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].symbol).toEqual(poolMock.symbol);
  });

  it('should NOT search pool (empty array)', async () => {
    prismaMock.pools.findMany.mockResolvedValue([]);

    await expect(poolService.searchPool(poolMock.symbol)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  // getPools
  it('should get pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock }] as pools[]);

    const pageSize = 1;
    const result = await poolService.getPools(1, pageSize);
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('should get pools (default values)', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock }] as pools[]);

    const result = await poolService.getPools();
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(poolMock.id);
  });

  // getPoolSymbols
  it('should get symbols', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue([
      { _id: poolMock.symbol },
    ] as unknown as JsonObject);

    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(poolMock.symbol);
  });

  it('should NOT get symbols (null)', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue(null!);

    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });

  // getTopPools
  it('should get top pools', async () => {
    prismaMock.pools.findMany
      .mockResolvedValueOnce([{ ...poolMock }] as pools[]) // top0Pools
      .mockResolvedValueOnce([{ ...poolMock }] as pools[]); // top1Pools

    const result = await poolService.getTopPools();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('should handle pools with null price changes in getTopPools', async () => {
    const poolWithNullValues = {
      ...poolMock,
      price0_60Change: null,
      price1_60Change: null,
    };

    prismaMock.pools.findMany
      .mockResolvedValueOnce([poolWithNullValues] as pools[]) // top0Pools
      .mockResolvedValueOnce([]); // top1Pools

    const result = await poolService.getTopPools();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty results in both queries for getTopPools', async () => {
    prismaMock.pools.findMany
      .mockResolvedValueOnce([]) // top0Pools
      .mockResolvedValueOnce([]); // top1Pools

    const result = await poolService.getTopPools();
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });
});
