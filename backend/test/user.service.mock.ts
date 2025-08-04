import { users } from 'commons/data';
import { ChainId } from 'commons/models/chainId';
import { Status } from 'commons/models/status';

export const newUserMock = {
  address: '0x123',
  name: 'Victor',
  id: 'abc123',
  email: 'victor@contato.com',
  status: Status.NEW,
  network: ChainId.POLYGON_MAINNET,
  planId: 'Gold',
  privateKey: 'abc123',
  activateCode: '123456',
  activateDate: new Date(),
} as users;
