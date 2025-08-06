import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Status } from 'commons/models/status';
import { User } from 'commons/models/user';
import { decrypt, encrypt } from 'commons/services/cryptoService';
import Config from '../config';
import db from '../db';
import { UserDTO } from './user.dto';
@Injectable()
export class UserService {
  async getUserByWallet(address: string): Promise<User> {
    const user = await db.users.findFirst({
      where: {
        address: {
          equals: address,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${address} not found`,
      );
    }

    user.privateKey = '';

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await db.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user.privateKey = decrypt(user.privateKey);

    return user;
  }

  static generateActivateCode(length: number): string {
    const validChars = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += validChars[Math.floor(Math.random() * 10)];
    }

    return code;
  }

  async addUser(user: UserDTO): Promise<User> {

    const oldUser = await db.users.findFirst({
      where: {
        OR: [
          {
            address: user.address,
          },
          {
            email: user.email,
          },
        ],
      },
    });

    if (oldUser) {
      if (oldUser.status !== Status.NEW) {
        throw new ConflictException(
          `User already exists with the same wallet or the same emnail.`,
        );
      } else {
        return db.users.update({
          where: { id: oldUser.id },
          data: {
            activateCode: UserService.generateActivateCode(6),
            activateDate: new Date(),
          },
        });
      }
    }

    return db.users.create({
      data: {
        address: user.address,
        email: user.email,
        name: user.name,
        planId: user.planId,
        activateCode: UserService.generateActivateCode(6),
        activateDate: new Date(),
        privateKey: '',
        status: Status.NEW,
        network: Config.CHAIN_ID,
      },
    });
  }

  async payUSer(address: string): Promise<User> {
    const user = await this.getUserByWallet(address);
    if (user.status !== Status.BLOCKED) throw new ForbiddenException();

    // to do: pay via blockchain

    const updateUser = await db.users.update({
      where: { id: user.id },
      data: { status: Status.ACTIVE },
    });

    user.privateKey = '';

    return updateUser;
  }

  async updateUser(id: string, user: UserDTO): Promise<User> {

    const data: any = {
      address: user.address,
      email: user.email,
      name: user.name,
    };

    if (user.privateKey) {
      data.privateKey = encrypt(user.privateKey);
    }

    const updatedUser = await db.users.update({
      where: { id },
      data,
    });

    if(updatedUser)
      updatedUser.privateKey = '';

    return updatedUser;
  }

  async activateUser(wallet: string, code: string): Promise<User> {
    const user = await this.getUserByWallet(wallet);

    if (user.status !== Status.NEW) return user;

    if (user.activateCode !== code)
      throw new UnauthorizedException(`Wrong activate code.`);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    if (user.activateDate < tenMinutesAgo)
      throw new UnauthorizedException(`activate code expired.`);

    const updatedUser = await db.users.update({
      where: { id: user.id },
      data: { status: Status.BLOCKED },
    });

    updatedUser.privateKey = '';

    return updatedUser;
  }
}
