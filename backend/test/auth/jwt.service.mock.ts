
import { JwtService } from '@nestjs/jwt';
import { JwtMock } from './auth.service.mock';

export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockResolvedValue('abc123'),
    decode: jest.fn().mockReturnValue(JwtMock),
    verify: jest.fn().mockResolvedValue(true),
  },
};