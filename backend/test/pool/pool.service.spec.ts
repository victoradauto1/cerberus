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

  it('should get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue({ ...poolMock } as pools);

    const result = await poolService.getPool(poolMock.id);
    expect(result).toBeDefined;
    expect(result.id).toEqual(poolMock.id);
  });

  it('should NOT get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue(null);

    await expect(poolService.getPool(poolMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('should search pool', async () => {
    prismaMock.pools.findFirst.mockResolvedValue({ ...poolMock } as pools);

    const result = await poolService.searchPool(poolMock.symbol, poolMock.fee);
    expect(result).toBeDefined;
    expect(result.symbol).toEqual(poolMock.symbol);
    expect(result.fee).toEqual(poolMock.fee);
  });

  it('should NOT search pool', async () => {
    prismaMock.pools.findFirst.mockResolvedValue(null);

    await expect(poolService.searchPool(poolMock.symbol, poolMock.fee)).rejects.toEqual(new NotFoundException());

  });

  it('should get pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock }] as pools[]);

    const pageSize = 1;
    const result = await poolService.getPools(1, pageSize);
    expect(result).toBeDefined;
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('should get pools (default values)', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock }] as pools[]);

    const result = await poolService.getPools();
    expect(result).toBeDefined;
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(poolMock.id);
  });


  it('should get symbols', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue([
      { _id: poolMock.symbol },
    ] as unknown as JsonObject);

    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined;
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(poolMock.symbol);
  });

  it('should NOT get symbols', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue(null!);

    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined;
    expect(result.length).toEqual(0);
  });

  it('should get top pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([{ ...poolMock }] as pools[]);

    const result = await poolService.getTopPools();
    expect(result).toBeDefined;
    expect(result.length).toEqual(2);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('should handle pools with null price changes in getTopPools', async () => {
  const poolWithNullValues = {
    ...poolMock,
    price0_60Change: null,
    price1_60Change: null,
  };

  prismaMock.pools.findMany.mockResolvedValue([poolWithNullValues] as pools[]);

  const result = await poolService.getTopPools();
  expect(result).toBeDefined();
});

it('should handle empty results in both queries for getTopPools', async () => {
  prismaMock.pools.findMany
    .mockResolvedValueOnce([]) // primeira query (top0Pools)
    .mockResolvedValueOnce([]); // segunda query (top1Pools)

  const result = await poolService.getTopPools();
  expect(result).toBeDefined();
  expect(result.length).toEqual(0);
});
});
