import { JWT } from 'commons/models/jwt';
import { Status } from 'commons/models/status';
import { AuthService } from '../../src/auth/auth.service';

export const JwtMock = {
  address: '0x123',
  name: 'Victor',
  planId: 'Gold',
  status: Status.ACTIVE,
  userId: 'abc123',
} as JWT;

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createJwt: jest.fn().mockResolvedValue('abc123'),
    decodeToken: jest.fn().mockReturnValue(JwtMock),
    checkToken: jest.fn().mockResolvedValue(true),
  },
};
