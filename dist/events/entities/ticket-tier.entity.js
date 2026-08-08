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
exports.TicketTier = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("./event.entity");
let TicketTier = class TicketTier {
    id;
    name;
    price;
    quota;
    soldQuota;
    eventId;
    event;
    createdAt;
    updatedAt;
};
exports.TicketTier = TicketTier;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TicketTier.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VIP Ticket' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], TicketTier.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150000 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TicketTier.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, typeorm_1.Column)({ type: 'int', default: 100 }),
    __metadata("design:type", Number)
], TicketTier.prototype, "quota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TicketTier.prototype, "soldQuota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TicketTier.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.ticketTiers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'eventId' }),
    __metadata("design:type", event_entity_1.Event)
], TicketTier.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TicketTier.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TicketTier.prototype, "updatedAt", void 0);
exports.TicketTier = TicketTier = __decorate([
    (0, typeorm_1.Entity)('ticket_tiers')
], TicketTier);
//# sourceMappingURL=ticket-tier.entity.js.map