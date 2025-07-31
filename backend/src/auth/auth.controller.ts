import {
  Controller,
  Body,
  Post,
  Param,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/use.service';
import { User } from 'commons/models/user';
import { MailerService } from '@nestjs-modules/mailer';
import Config from '../config';
import { AuthService } from './auth.service';
import { JWT } from 'commons/models/jwt';
import { Status } from 'commons/models/status';
import { ethers, Wallet } from 'ethers';
import { NotFoundError } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
  ) {}

  @Post('singin')
  async singin(@Body() data: AuthDTO): Promise<string> {
    const aMinAgo = Date.now() - 60 * 1000;
    if (data.timestamp < aMinAgo)
      throw new BadRequestException('timestamp too old.');

    const message = Config.AUTH_MSG.replace(
      '<timestamp>',
      Date.now().toString(),
    );

    let wallet;
    try {
      wallet = ethers.verifyMessage(message, data.secret);
    } catch (error) {
      throw new BadRequestException('Invalid secret.');
    }

    if (wallet.toUpperCase() === data.wallet.toUpperCase()) {
      const user = await this.userService.getUserByWallet(wallet);
      if (!user) throw new NotFoundException('User not found. Signup first.');
      if (user.status === Status.BANNED)
        throw new UnauthorizedException('Banned user.');
      return this.authService.createJwt({
        userId: user.id,
        address: user.address,
        name: user.name,
        planId: user.planId,
        status: user.status,
      } as JWT);
    }

    throw new UnauthorizedException("Wallet and secret doesn't match.");
  }

  @Post('singup')
  async singup(@Body() data: UserDTO): Promise<User> {
    const user = await this.userService.addUser(data);

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Active your user on Cerberus`,
      text: `Hi, ${user.name}!
            
            Use the link below to finish your signup (copy and paste if the link doesn't work):

            ${Config.SITE_URL}/activate?wallet=${user.address}&code=${user.activateCode}

            Or if you are with the activate page opened, use the code below:

            ${user.activateCode}

            See you later!

            Admin
            `,
    });

    return user;
  }

  @Post('activate/:wallet/:code')
  async activate(
    @Param('wallet') wallet: string,
    @Param('code') code: string,
  ): Promise<string> {
    const user = await this.userService.activateUser(wallet, code);

    await this.mailerService.sendMail({
      to: user.email,
      subject: `User activate! Nexte steps in this email`,
      text: `Hi, ${user.name}!
            
            Your user is activate, but before you start bot trading, you need to pay first month in advance.
            Use the link below to make your payment (copy and paste if the link doesn't work):

            ${Config.SITE_URL}/pay/${user.address}

            Or if you are with the website opened, ujust click in the login button again.

            See you later!

            Admin
            `,
    });

    return this.authService.createJwt({
      userId: user.id,
      address: user.address,
      name: user.name,
      planId: user.planId,
      status: user.status,
    } as JWT);
  }
}
