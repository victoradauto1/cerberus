import Automation from 'commons/models/automation';
import { ChainId } from 'commons/models/chainId';
import { Exchange } from 'commons/models/exchange';
import { AutomationService } from '../../src/automation/automation.service';

export const newAutomationMock = {
  id: 'automation123',
  name: 'Automation Test',
  userId: 'user123',
  poolId: 'pool123',
  exchange: Exchange.Uniswap,
  network: ChainId.POLYGON_MAINNET,
  isActive: true,
  isOpened: false,
  nextAmount: '10',
  openCondition: {
    field: 'price0',
    operator: '==',
    value: '0',
  },
  closeCondition: {
    field: 'price0',
    operator: '==',
    value: '0',
  },
} as Automation;

export const activeAutomationMock = {
  ...newAutomationMock,
  isActive: true,
} as Automation;

export const InactiveAutomationMock = {
  ...newAutomationMock,
  isActive: false,
} as Automation;

export const automationServiceMock = {
  provide: AutomationService,
  useValue: {
    getAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    getAutomations: jest.fn().mockResolvedValue([activeAutomationMock]),
    getActiveAutomations: jest.fn().mockResolvedValue([activeAutomationMock]),
    addAutomnation: jest.fn().mockResolvedValue(activeAutomationMock),
    updateAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    deleteAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    startAutomation: jest.fn().mockResolvedValue(activeAutomationMock),
    stopAutomation: jest.fn().mockResolvedValue(InactiveAutomationMock),
  },
};
