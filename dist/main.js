"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    const apiPrefix = configService.get('API_PREFIX', 'api/v1');
    app.enableCors();
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('🎵 Eventix API — Platform Tiket Konser')
        .setDescription('Dokumentasi API Platform Penjualan Tiket Konser Eventix.\n\n' +
        '**Login Admin Default:** `admin@gmail.com` / `Admin123!`\n\n' +
        'Gunakan endpoint `POST /api/v1/auth/login` untuk mendapatkan token JWT, ' +
        'lalu klik tombol **Authorize** 🔒 di kanan atas untuk mengakses endpoint yang dilindungi.')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('1. Autentikasi', 'Pendaftaran akun, login (User, Organizer, Admin), Google login, dan logout')
        .addTag('2. Pengunjung (User)', 'Profil, penelusuran event, pembelian tiket, pembayaran, serta tiket saya')
        .addTag('3. Organizer', 'Dashboard statistik, kelola event/tiket, kelola pembayaran manual, verifikasi bukti bayar, profil, dan sertifikat')
        .addTag('4. Admin', 'Dashboard statistik platform, manajemen akun organizer/user, manajemen persetujuan event, dan kategori')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    const allowedTags = [
        '1. Autentikasi',
        '2. Pengunjung (User)',
        '3. Organizer',
        '4. Admin',
    ];
    if (document.tags) {
        document.tags = document.tags.filter((tag) => allowedTags.includes(tag.name));
    }
    if (document.paths) {
        for (const path of Object.values(document.paths)) {
            for (const operation of Object.values(path)) {
                if (operation && operation.tags) {
                    operation.tags = operation.tags.filter((tag) => allowedTags.includes(tag));
                }
            }
        }
    }
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port);
    common_1.Logger.log(`🚀 Aplikasi Eventix Backend berjalan di: http://localhost:${port}/${apiPrefix}`);
    common_1.Logger.log(`📖 Dokumentasi Swagger OpenAPI tersedia di: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map