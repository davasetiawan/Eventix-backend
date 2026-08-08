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
exports.Registration = exports.RegistrationStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const event_entity_1 = require("../../events/entities/event.entity");
const ticket_tier_entity_1 = require("../../events/entities/ticket-tier.entity");
const payment_method_entity_1 = require("../../payment-methods/entities/payment-method.entity");
var RegistrationStatus;
(function (RegistrationStatus) {
    RegistrationStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    RegistrationStatus["PAYMENT_SUBMITTED"] = "PAYMENT_SUBMITTED";
    RegistrationStatus["VERIFIED"] = "VERIFIED";
    RegistrationStatus["REJECTED"] = "REJECTED";
    RegistrationStatus["CANCELLED"] = "CANCELLED";
})(RegistrationStatus || (exports.RegistrationStatus = RegistrationStatus = {}));
let Registration = class Registration {
    id;
    ticketCode;
    status;
    quantity;
    totalPrice;
    paymentProofUrl;
    rejectionReason;
    verifiedAt;
    userId;
    user;
    eventId;
    event;
    ticketTierId;
    ticketTier;
    paymentMethodId;
    paymentMethod;
    qrCodeUrl;
    createdAt;
    updatedAt;
};
exports.Registration = Registration;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Registration.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TKT-17182903' }),
    (0, typeorm_1.Column)({ type: 'varchar', unique: true, length: 50 }),
    __metadata("design:type", String)
], Registration.prototype, "ticketCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RegistrationStatus,
        example: RegistrationStatus.PENDING_PAYMENT,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RegistrationStatus,
        default: RegistrationStatus.PENDING_PAYMENT,
    }),
    __metadata("design:type", String)
], Registration.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Registration.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100000 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Registration.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/proof-12345.jpg' }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "paymentProofUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bukti transfer buram' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Registration.prototype, "verifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Registration.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.registrations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Registration.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Registration.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => event_entity_1.Event }),
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.registrations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'eventId' }),
    __metadata("design:type", event_entity_1.Event)
], Registration.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "ticketTierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => ticket_tier_entity_1.TicketTier }),
    (0, typeorm_1.ManyToOne)(() => ticket_tier_entity_1.TicketTier, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ticketTierId' }),
    __metadata("design:type", ticket_tier_entity_1.TicketTier)
], Registration.prototype, "ticketTier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a' }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "paymentMethodId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => payment_method_entity_1.PaymentMethod }),
    (0, typeorm_1.ManyToOne)(() => payment_method_entity_1.PaymentMethod, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'paymentMethodId' }),
    __metadata("design:type", payment_method_entity_1.PaymentMethod)
], Registration.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/qrcode-12345.png' }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Registration.prototype, "qrCodeUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "updatedAt", void 0);
exports.Registration = Registration = __decorate([
    (0, typeorm_1.Entity)('registrations')
], Registration);
//# sourceMappingURL=registration.entity.js.map