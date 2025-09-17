import { Test, TestingModule } from '@nestjs/testing';
import { automations } from 'commons/data';
import { AutomationService } from 'src/automation/automation.service';
import { prismaMock } from 'test/db.mock';
import {
  activeAutomationMock,
  InactiveAutomationMock,
  newAutomationMock,
} from './automation.service.mock';
import { AutomationDTO } from '../../src/automation/automation.dto';

describe('Automation Service tests', () => {
  const userId = 'user123';

  let automationService: AutomationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [AutomationService],
    }).compile();

    automationService = moduleFixture.get<AutomationService>(AutomationService);
  });

  it('should be defined', () => {
    expect(automationService).toBeDefined();
  });

  it('should get automation', async () => {
    prismaMock.automations.findUnique.mockResolvedValue({
      ...newAutomationMock,
    } as automations);

    const result = await automationService.getAutomation(
      'automation123',
      userId,
    );
    expect(result).toBeDefined();
    expect(result!.id).toEqual(newAutomationMock.id);
  });

  it('should get automations', async () => {
    prismaMock.automations.findMany.mockResolvedValue([
      { ...newAutomationMock },
    ] as automations[]);

    const pageSize = 1;
    const result = await automationService.getAutomations(userId, 1, pageSize);
    expect(result.length).toEqual(pageSize);
    expect(result[0].id).toEqual(newAutomationMock.id);
  });

  it('should get active automations', async () => {
    prismaMock.automations.findMany.mockResolvedValue([
      { ...activeAutomationMock },
    ] as automations[]);

    const automations = await automationService.getActiveAutomations(userId);
    
    expect(automations.length).toEqual(1);
  });

  it('should add automations', async () => {
    prismaMock.automations.findMany.mockResolvedValue([
      { ...newAutomationMock },
    ] as automations[]);

    const automation = { ...newAutomationMock } as AutomationDTO;
    const result = await automationService.addAutomation(userId, automation);

    expect(result.id).toBeTruthy();
  });

  it('should add automation (inactive)', async () => {
    prismaMock.automations.findMany.mockResolvedValue([
      { ...newAutomationMock },
    ] as automations[]);

    const automation = { ...InactiveAutomationMock } as AutomationDTO;
    const result = await automationService.addAutomation(userId, automation);

    expect(result.id).toBeTruthy();
  });

  it('should get start automations', async () => {
    prismaMock.automations.findFirst.mockResolvedValue({...InactiveAutomationMock} as automations);
    prismaMock.automations.update.mockResolvedValue({...activeAutomationMock} as automations);

    const result = await automationService.startAutomation(newAutomationMock.id!, userId);
    expect(result.id).toEqual(newAutomationMock.id);
    expect(result.isActive).toBeTruthy();
  });

  it('should get stop automations', async () => {
    prismaMock.automations.findFirst.mockResolvedValue({...InactiveAutomationMock} as automations);
    prismaMock.automations.update.mockResolvedValue({...activeAutomationMock} as automations);

    const result = await automationService.stopAutomation(newAutomationMock.id!, userId);
    expect(result.id).toEqual(newAutomationMock.id);
    expect(result.isActive).toBeFalsy();
  });

  it('should get update automations', async () => {
    prismaMock.automations.update.mockResolvedValue({...newAutomationMock} as automations);

    const result = await automationService.updateAutomation(newAutomationMock.id!, userId, { ...newAutomationMock} as AutomationDTO);
    expect(result.id).toEqual(newAutomationMock.id);
  });

  it('should get update (inactive) automations', async () => {
    prismaMock.automations.update.mockResolvedValue({...InactiveAutomationMock} as automations);

    const result = await automationService.updateAutomation(InactiveAutomationMock.id!, userId, { ...InactiveAutomationMock} as AutomationDTO);
    expect(result.id).toEqual(InactiveAutomationMock.id);
  });

  it('should delete automations', async () => {
    prismaMock.automations.delete.mockResolvedValue({...newAutomationMock} as automations);

    const result = await automationService.deleteAutomation(newAutomationMock.id!, userId);
    expect(result.id).toEqual(newAutomationMock.id);
  });

});
