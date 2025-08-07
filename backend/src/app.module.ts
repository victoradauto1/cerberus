/*istanbul ignore file */

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import Config from './config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: Config.MAILER_TRANSPORT,
      defaults: {
        from: Config.DEFAULT_FROM,
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
    AuthModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, AuthService, JwtService],
})
export class AppModule {}
