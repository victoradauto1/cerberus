import { JWT } from 'commons/models/jwt';
import { AuthService } from '../../src/auth/auth.service';
import { Status } from 'commons/models/status';

export const JwtMock = {
  address: '0X123',
  name: 'Victor',
  planId: 'Gold',
  status: Status.ACTIVE,
  userId: 'abc123',
} as JWT;

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockResolvedValue('abc123'),
    decodeToken: jest.fn().mockReturnValue(JwtMock),
    checkToken: jest.fn().mockResolvedValue(true)
  },
};
