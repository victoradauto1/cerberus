import Automation from 'commons/models/automation';
import { ChainId } from 'commons/models/chainId';
import { Exchange } from 'commons/models/exchange';

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
