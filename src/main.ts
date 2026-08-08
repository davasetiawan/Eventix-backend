import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

  // Enable CORS
  app.enableCors();

  // Set Global API Prefix
  app.setGlobalPrefix(apiPrefix);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Setup Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('🎵 Eventix API — Platform Tiket Konser')
    .setDescription(
      'Dokumentasi API Platform Penjualan Tiket Konser Eventix.\n\n' +
        '**Login Admin Default:** `admin@gmail.com` / `Admin123!`\n\n' +
        'Gunakan endpoint `POST /api/v1/auth/login` untuk mendapatkan token JWT, ' +
        'lalu klik tombol **Authorize** 🔒 di kanan atas untuk mengakses endpoint yang dilindungi.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(
      '1. Autentikasi',
      'Pendaftaran akun, login (User, Organizer, Admin), Google login, dan logout',
    )
    .addTag(
      '2. Pengunjung (User)',
      'Profil, penelusuran event, pembelian tiket, pembayaran, serta tiket saya',
    )
    .addTag(
      '3. Organizer',
      'Dashboard statistik, kelola event/tiket, kelola pembayaran manual, verifikasi bukti bayar, profil, dan sertifikat',
    )
    .addTag(
      '4. Admin',
      'Dashboard statistik platform, manajemen akun organizer/user, manajemen persetujuan event, dan kategori',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Hanya tampilkan 4 kelompok tag PRD — hapus semua tag lain (Auth, Users, Events, dll)
  const allowedTags = [
    '1. Autentikasi',
    '2. Pengunjung (User)',
    '3. Organizer',
    '4. Admin',
  ];

  // Filter array tags global
  if (document.tags) {
    document.tags = document.tags.filter((tag) =>
      allowedTags.includes(tag.name),
    );
  }

  // Filter tags di setiap operation path agar tidak memunculkan grup ekstra
  if (document.paths) {
    for (const path of Object.values(document.paths)) {
      for (const operation of Object.values(
        path as Record<string, { tags?: string[] }>,
      )) {
        if (operation && operation.tags) {
          operation.tags = operation.tags.filter((tag) =>
            allowedTags.includes(tag),
          );
        }
      }
    }
  }

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Aplikasi Eventix Backend berjalan di: http://localhost:${port}/${apiPrefix}`,
  );
  Logger.log(
    `📖 Dokumentasi Swagger OpenAPI tersedia di: http://localhost:${port}/docs`,
  );
}

bootstrap();
