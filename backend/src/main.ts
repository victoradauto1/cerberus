import Config from "./config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: Config.CORS_ORIGIN
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Config.PORT, ()=> console.log(`Running backend at ${Config.PORT}`));
}
bootstrap();
