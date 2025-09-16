import { Test, TestingModule } from '@nestjs/testing';
import { automations } from 'commons/data';
import { AutomationService } from 'src/automation/automation.service';
import { prismaMock } from 'test/db.mock';
import { newAutomationMock } from './automation.service.mock';

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
      ...newAutomationMock
    } as automations);

    const result = await automationService.getAutomation(
      'automation123',
      userId,
    );
    expect(result).toBeDefined();
    expect(result!.id).toEqual(newAutomationMock.id);
  });

  it('should get automations', async () => {
    prismaMock.automations.findMany.mockResolvedValue([{...newAutomationMock}] as automations[]);

    const pageSize = 1;
    const result = await automationService.getAutomations(userId,
      1, pageSize
    );
    expect(result.length).toEqual(pageSize);
    expect(result[0].id).toEqual(newAutomationMock.id);
  });

});
