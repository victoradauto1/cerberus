import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import Config from './config';
import { UserController } from './user/use.controller';
import { UserService } from './user/use.service';

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
  providers: [AppService, UserService],
})
export class AppModule {}
