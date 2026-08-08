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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.PaymentMethodType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["BANK"] = "BANK";
    PaymentMethodType["EWALLET"] = "EWALLET";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
let PaymentMethod = class PaymentMethod {
    id;
    type;
    bankName;
    accountNumber;
    accountHolderName;
    isActive;
    organizerId;
    organizer;
    createdAt;
    updatedAt;
};
exports.PaymentMethod = PaymentMethod;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentMethod.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaymentMethodType, example: PaymentMethodType.BANK }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethodType,
        default: PaymentMethodType.BANK,
    }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bank BCA' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PT Eventix Indonesia' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "accountHolderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "organizerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'organizerId' }),
    __metadata("design:type", user_entity_1.User)
], PaymentMethod.prototype, "organizer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "updatedAt", void 0);
exports.PaymentMethod = PaymentMethod = __decorate([
    (0, typeorm_1.Entity)('payment_methods')
], PaymentMethod);
//# sourceMappingURL=payment-method.entity.js.map