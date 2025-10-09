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
import { PoolController } from './pool/pool.controller'
import { PoolService } from './pool/pool.service';
import { AuthController } from './auth/auth.controller';
import { AutomationService } from './automation/automation.service';
import { TradeController } from './trade/trade.controller';
import { TradeService } from './trade/trade.service';

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
  controllers: [AppController, UserController, PoolController, AuthController, TradeController],
  providers: [AppService, UserService, AuthService, JwtService, PoolService, AutomationService, TradeService],
})
export class AppModule {}
