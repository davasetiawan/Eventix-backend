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
exports.PaymentMethodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_method_entity_1 = require("./entities/payment-method.entity");
const user_entity_1 = require("../users/entities/user.entity");
let PaymentMethodsService = class PaymentMethodsService {
    paymentMethodRepository;
    constructor(paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }
    checkOrganizerVerification(user) {
        if (user.role === user_entity_1.UserRole.ORGANIZER && !user.isVerified) {
            throw new common_1.ForbiddenException('Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan tindakan ini.');
        }
    }
    async create(createDto, user) {
        this.checkOrganizerVerification(user);
        const paymentMethod = this.paymentMethodRepository.create({
            ...createDto,
            organizerId: user.id,
        });
        return this.paymentMethodRepository.save(paymentMethod);
    }
    async findAllForOrganizer(organizerId) {
        return this.paymentMethodRepository.find({
            where: { organizerId, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findAllMyMethods(user) {
        this.checkOrganizerVerification(user);
        return this.paymentMethodRepository.find({
            where: { organizerId: user.id },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const method = await this.paymentMethodRepository.findOne({
            where: { id },
        });
        if (!method) {
            throw new common_1.NotFoundException('Metode pembayaran tidak ditemukan');
        }
        return method;
    }
    async update(id, updateDto, user) {
        this.checkOrganizerVerification(user);
        const method = await this.findOne(id);
        if (method.organizerId !== user.id && user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk mengubah metode pembayaran ini');
        }
        Object.assign(method, updateDto);
        return this.paymentMethodRepository.save(method);
    }
    async remove(id, user) {
        this.checkOrganizerVerification(user);
        const method = await this.findOne(id);
        if (method.organizerId !== user.id && user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk menghapus metode pembayaran ini');
        }
        await this.paymentMethodRepository.remove(method);
    }
};
exports.PaymentMethodsService = PaymentMethodsService;
exports.PaymentMethodsService = PaymentMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethod)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentMethodsService);
//# sourceMappingURL=payment-methods.service.js.map