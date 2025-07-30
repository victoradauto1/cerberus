import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/use.service';
import { User } from 'commons/models/user';
import { MailerService } from '@nestjs-modules/mailer';
import Config from '../config';
import { authService } from './auth.service';
import { JWT } from 'commons/models/jwt';
import { Status } from 'commons/models/status';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly authService: authService,
  ) {}

  @Post('singin')
  singin(@Body() data: AuthDTO): object {
    return data;
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
