import { Test, TestingModule } from "@nestjs/testing";
import { newAutomationMock, poolServiceMock } from "../pool/pool.service.mock";
import { authServiceMock } from "../../test/auth/auth.service.mock";
import { NotFoundException } from "@nestjs/common";
import { AutomationController } from "../../src/automation/automation.controller";

import { automationServiceMock, newAutomationMock } from "./automation.service.mock";

import { userServiceMock } from "test/user/user.service.mock";

describe('AutomationController tests', () => {

  const authorization = "authorization";
  let automationController: AutomationController;

  beforeAll(async () => {
        
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AutomationController],
      providers: [automationServiceMock, poolServiceMock, userServiceMock, authServiceMock],
      
    }).compile();

    automationController = moduleFixture.get<AutomationController>(AutomationController);
  });

  it('should be defined', () => {
    expect(automationController).toBeDefined();
  });

   it('should get automation', async () => {
    const automation =  await automationController.getAutomation(newAutomationMock.id!, authorization)
    expect(automation).toBeDefined();
    expect(automation!.id).toEqual(newAutomationMock.id);
  });

  it('should NOT get pool', async () => {
    poolServiceMock.useValue.getPool.mockResolvedValue(null)
    await expect(poolController.getPool(newAutomationMock.id)).rejects.toEqual(new NotFoundException());
  });

  it('should search pool', async () => {
    const pool =  await poolController.searchPool(newAutomationMock.symbol);
    expect(pool).toBeDefined();
    expect(pool.length).toBeTruthy();
  });

  it('should NOT search pool', async () => {
    poolServiceMock.useValue.searchPool.mockResolvedValue(null)
    await expect(poolController.searchPool(newAutomationMock.symbol)).rejects.toEqual(new NotFoundException());
  });

  it('should get pools', async () => {
    const pools =  await poolController.getPools(1, 1);
    expect(pools).toBeDefined();
    expect(pools.length).toEqual(1);
    expect(pools[0].id).toEqual(newAutomationMock.id);
  });

   it('should get top pools', async () => {
    const pools =  await poolController.topPools();
    expect(pools).toBeDefined();
    expect(pools.length).toEqual(1);
    expect(pools[0].id).toEqual(newAutomationMock.id);
  });

  it('should get symbols', async () => {
    const symbols =  await poolController.getSymbols();
    expect(symbols).toBeDefined();
    expect(symbols.length).toEqual(1);
    expect(symbols[0]).toEqual(newAutomationMock.symbol);
  });
  
  
})