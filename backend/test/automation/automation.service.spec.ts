import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationService } from 'src/automation/automation.service';


describe('Automation Service tests', () => {
  let automationService: AutomationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [AutomationService],
    }).compile();

    automationService = moduleFixture.get<AutomationService>(AutomationService);
  });

});
