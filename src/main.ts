import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = setupApp(app);

  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Aplikasi Eventix Backend berjalan di: http://localhost:${port}/${apiPrefix}`,
  );
  Logger.log(
    `📖 Dokumentasi Swagger OpenAPI tersedia di: http://localhost:${port}/docs`,
  );
}

bootstrap();
