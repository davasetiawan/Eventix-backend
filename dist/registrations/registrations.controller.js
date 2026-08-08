"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const registrations_service_1 = require("./registrations.service");
const create_registration_dto_1 = require("./dto/create-registration.dto");
const verify_payment_dto_1 = require("./dto/verify-payment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const registration_entity_1 = require("./entities/registration.entity");
let RegistrationsController = class RegistrationsController {
    registrationsService;
    constructor(registrationsService) {
        this.registrationsService = registrationsService;
    }
    register(createRegistrationDto, user, paymentProof) {
        return this.registrationsService.register(createRegistrationDto, user, paymentProof);
    }
    findMyTickets(user) {
        return this.registrationsService.findMyTickets(user);
    }
    findOrganizerPayments(user) {
        return this.registrationsService.findOrganizerPayments(user);
    }
    verifyPayment(id, dto, user) {
        return this.registrationsService.verifyPayment(id, dto, user);
    }
    findOne(id) {
        return this.registrationsService.findOne(id);
    }
    async downloadTicketPdf(id, user, res) {
        const pdfBuffer = await this.registrationsService.generateTicketPdf(id, user);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
            'Content-Length': String(pdfBuffer.length),
        });
        res.end(pdfBuffer);
    }
};
exports.RegistrationsController = RegistrationsController;
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Checkout / Beli Tiket Konser — User',
        description: 'Lakukan pemesanan tiket konser. Upload bukti pembayaran dalam format file gambar menggunakan **multipart/form-data**.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['eventId'],
            properties: {
                eventId: { type: 'string', format: 'uuid', example: 'uuid-event-id' },
                ticketTierId: { type: 'string', format: 'uuid', example: 'uuid-ticket-tier-id' },
                quantity: { type: 'number', example: 1, default: 1 },
                paymentMethodId: { type: 'string', format: 'uuid', example: 'uuid-payment-method-id' },
                paymentProof: {
                    type: 'string',
                    format: 'binary',
                    description: 'File bukti pembayaran (JPG, PNG, WEBP — maks 5MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: registration_entity_1.Registration,
        description: 'Pesanan tiket berhasil dibuat',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('paymentProof', {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new common_1.BadRequestException('Format bukti pembayaran tidak didukung (Gunakan JPG, PNG, atau WEBP)'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_registration_dto_1.CreateRegistrationDto,
        user_entity_1.User, Object]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)('my-tickets'),
    (0, swagger_1.ApiOperation)({ summary: 'Daftar Tiket yang Dimiliki — User' }),
    (0, swagger_1.ApiOkResponse)({
        type: [registration_entity_1.Registration],
        description: 'Daftar tiket milik pengguna',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "findMyTickets", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Get)('organizer/payments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Daftar Pembayaran Masuk dari Pembeli — Organizer' }),
    (0, swagger_1.ApiOkResponse)({
        type: [registration_entity_1.Registration],
        description: 'Daftar pembayaran masuk untuk event milik organizer',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "findOrganizerPayments", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Patch)(':id/verify-payment'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Approve / Reject Bukti Pembayaran — Organizer' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID Registrasi/Tiket yang ingin diverifikasi',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: registration_entity_1.Registration,
        description: 'Status pembayaran berhasil diverifikasi',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, verify_payment_dto_1.VerifyPaymentDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "verifyPayment", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detail Tiket / Registrasi — User' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Registrasi/Tiket' }),
    (0, swagger_1.ApiOkResponse)({ type: registration_entity_1.Registration, description: 'Detail registrasi tiket' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)(':id/ticket-pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Download Tiket PDF + QR Code — User' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Registrasi/Tiket' }),
    (0, swagger_1.ApiProduces)('application/pdf'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File PDF Tiket Digital berhasil diunduh',
        schema: {
            type: 'string',
            format: 'binary',
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], RegistrationsController.prototype, "downloadTicketPdf", null);
exports.RegistrationsController = RegistrationsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('registrations'),
    __metadata("design:paramtypes", [registrations_service_1.RegistrationsService])
], RegistrationsController);
//# sourceMappingURL=registrations.controller.js.map