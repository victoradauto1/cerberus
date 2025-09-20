import { Test, TestingModule } from "@nestjs/testing";
import { authServiceMock } from "../../test/auth/auth.service.mock";
import { NotFoundException } from "@nestjs/common";
import { AutomationController } from "../../src/automation/automation.controller";
import { activeAutomationMock, automationServiceMock, InactiveAutomationMock, newAutomationMock } from "./automation.service.mock";
import { activeUserMock, userServiceMock } from "test/user/user.service.mock";
import { AutomationDTO } from "../../src/automation/automation.dto";
import { poolServiceMock } from "test/pool/pool.service.mock";

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

   it('should get automations', async () => {
    const automations =  await automationController.getAutomations(authorization)
    expect(automations).toBeDefined();
    expect(automations.length).toBeTruthy();
  });

  it('should get active automations', async () => {
    const automations =  await automationController.getActiveAutomations(authorization)
    expect(automations).toBeDefined();
    expect(automations.length).toBeTruthy();
  });

  it('should add automation', async () => {
    const automationData= { ...activeAutomationMock} as AutomationDTO;
    const result = await automationController.addAutomation(automationData, authorization);
    expect(result.id).toBeTruthy();
  });

  it('should add automation (opened)', async () => {
    const automationData= { ...activeAutomationMock, isOpened:true, closeCondition: undefined} as AutomationDTO;
    const result = await automationController.addAutomation(automationData, authorization);
    expect(result.id).toBeTruthy();
  });

  it('should NOT add automation (price1)', async () => {
    userServiceMock.useValue.getUser = jest.fn().mockResolvedValue({...activeAutomationMock, privateKey: null});
    const automationData= { ...activeAutomationMock} as AutomationDTO;
    await expect(automationController.addAutomation(automationData, authorization))
      .rejects
      .toEqual(new Error('You must have a private key is settings before you update a automation.'));
    userServiceMock.useValue.getUser =jest.fn().mockResolvedValue(activeUserMock);
  });

  it('should update automation', async () => {
    const automationData= { ...activeAutomationMock} as AutomationDTO;
    const result = await automationController.updateAutomation(activeAutomationMock.id!, automationData, authorization);
    expect(result!.id).toEqual(activeAutomationMock.id);
  });

  it('should update automation (inactive)', async () => {
    const automationData= { ...InactiveAutomationMock} as AutomationDTO;
    const result = await automationController.updateAutomation(activeAutomationMock.id!, automationData, authorization);
    expect(result!.id).toEqual(activeAutomationMock.id);
  });

  it('should update automation (opened)', async () => {
    const automationData= { ...activeAutomationMock, closeCondition:undefined, isOpened: true} as AutomationDTO;
    const result = await automationController.updateAutomation(InactiveAutomationMock.id!, automationData, authorization);
    expect(result!.id).toEqual(activeAutomationMock.id);
  });

  it('should update automation (price1)', async () => {
    const automationData= { ...activeAutomationMock, openCondition:{
      field:"price1",
      operator:"==",
      value: "0"
    }} as AutomationDTO;
    const result = await automationController.updateAutomation(InactiveAutomationMock.id!, automationData, authorization);
    expect(result!.id).toEqual(activeAutomationMock.id);
  });

  it('should NOT update automation (price1)', async () => {
    userServiceMock.useValue.getUser = jest.fn().mockResolvedValue({...activeAutomationMock, privateKey: null});
    const automationData= { ...activeAutomationMock} as AutomationDTO;
    await expect(automationController.updateAutomation(activeAutomationMock!.id, automationData, authorization))
      .rejects
      .toEqual(new Error('You must have a private key is settings before you update a automation.'));
    userServiceMock.useValue.getUser =jest.fn().mockResolvedValue(activeUserMock);
  });


})