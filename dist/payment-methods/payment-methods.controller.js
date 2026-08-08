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
exports.PaymentMethodsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_methods_service_1 = require("./payment-methods.service");
const create_payment_method_dto_1 = require("./dto/create-payment-method.dto");
const update_payment_method_dto_1 = require("./dto/update-payment-method.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const payment_method_entity_1 = require("./entities/payment-method.entity");
let PaymentMethodsController = class PaymentMethodsController {
    paymentMethodsService;
    constructor(paymentMethodsService) {
        this.paymentMethodsService = paymentMethodsService;
    }
    findAllForOrganizer(organizerId) {
        return this.paymentMethodsService.findAllForOrganizer(organizerId);
    }
    findMyMethods(user) {
        return this.paymentMethodsService.findAllMyMethods(user);
    }
    findOne(id) {
        return this.paymentMethodsService.findOne(id);
    }
    create(createDto, user) {
        return this.paymentMethodsService.create(createDto, user);
    }
    update(id, updateDto, user) {
        return this.paymentMethodsService.update(id, updateDto, user);
    }
    remove(id, user) {
        return this.paymentMethodsService.remove(id, user);
    }
};
exports.PaymentMethodsController = PaymentMethodsController;
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)('organizer/:organizerId'),
    (0, swagger_1.ApiParam)({ name: 'organizerId', description: 'ID Organizer' }),
    (0, swagger_1.ApiOperation)({
        summary: 'Melihat Rekening/E-Wallet Organizer untuk Transfer — Public',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: [payment_method_entity_1.PaymentMethod],
        description: 'Daftar metode pembayaran organizer',
    }),
    __param(0, (0, common_1.Param)('organizerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "findAllForOrganizer", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Get)('my-methods'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar Rekening/E-Wallet Milik Organizer — Organizer',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: [payment_method_entity_1.PaymentMethod],
        description: 'Daftar rekening bank/e-wallet milik organizer sendiri',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "findMyMethods", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Metode Pembayaran' }),
    (0, swagger_1.ApiOperation)({ summary: 'Detail Metode Pembayaran — Public' }),
    (0, swagger_1.ApiOkResponse)({
        type: payment_method_entity_1.PaymentMethod,
        description: 'Detail metode pembayaran',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('🎪 Organizer'),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah Rekening Bank / E-Wallet — Organizer' }),
    (0, swagger_1.ApiCreatedResponse)({
        type: payment_method_entity_1.PaymentMethod,
        description: 'Metode pembayaran baru berhasil didaftarkan',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_method_dto_1.CreatePaymentMethodDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('🎪 Organizer'),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Ubah / Aktifkan / Nonaktifkan Metode Pembayaran — Organizer',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Metode Pembayaran' }),
    (0, swagger_1.ApiOkResponse)({
        type: payment_method_entity_1.PaymentMethod,
        description: 'Metode pembayaran berhasil diperbarui',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_method_dto_1.UpdatePaymentMethodDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiTags)('🎪 Organizer'),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus Metode Pembayaran — Organizer' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID Metode Pembayaran yang ingin dihapus',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Metode pembayaran berhasil dihapus' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "remove", null);
exports.PaymentMethodsController = PaymentMethodsController = __decorate([
    (0, common_1.Controller)('payment-methods'),
    __metadata("design:paramtypes", [payment_methods_service_1.PaymentMethodsService])
], PaymentMethodsController);
//# sourceMappingURL=payment-methods.controller.js.map