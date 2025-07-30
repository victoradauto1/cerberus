import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'commons/models/jwt';
import Config from 'src/config';

@Injectable()
export class authService {
  constructor(private readonly jwtService: JwtService) {}

  async createJwt(payload: JWT): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: Config.JWT_SECRET,
      expiresIn: Config.JWT_EXPIRES,
    });
  }

  decodeToken(authorization: String): JWT {
    return this.jwtService.decode(authorization.replace('Bearer ', '')) as JWT;
  }

  async checkToken(token: string): Promise<boolean | JWT> {
    try {
      return this.jwtService.verify(token.replace('Bearer ', ''), {
        secret: Config.JWT_SECRET,
      }) as JWT;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
