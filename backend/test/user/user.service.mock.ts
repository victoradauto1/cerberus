import { users } from 'commons/data';
import { ChainId } from 'commons/models/chainId';
import { Status } from 'commons/models/status';
import { UserService } from '../../src/user/user.service';

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

export const blockedUserMock = {
  ...newUserMock,
  status: Status.BLOCKED,
};

export const activeUserMock = {
  ...newUserMock,
  status: Status.ACTIVE,
};

export const userServiceMock = {
  provide: UserService,
  useValue: {
    getUserByWallet: jest.fn().mockResolvedValue(activeUserMock),
    getUser: jest.fn().mockResolvedValue(activeUserMock),
    activateUser: jest.fn().mockResolvedValue(blockedUserMock),
    updateUser: jest.fn().mockResolvedValue(activeUserMock),
    payUser: jest.fn().mockResolvedValue(activeUserMock),
    addUser: jest.fn().mockResolvedValue(newUserMock),
  },
};
