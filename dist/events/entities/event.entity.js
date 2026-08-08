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
exports.Event = exports.EventStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const registration_entity_1 = require("../../registrations/entities/registration.entity");
const ticket_tier_entity_1 = require("./ticket-tier.entity");
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "DRAFT";
    EventStatus["PUBLISHED"] = "PUBLISHED";
    EventStatus["CANCELLED"] = "CANCELLED";
    EventStatus["COMPLETED"] = "COMPLETED";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
let Event = class Event {
    id;
    title;
    slug;
    description;
    startDate;
    endDate;
    location;
    price;
    quota;
    bannerUrl;
    isApproved;
    status;
    organizerId;
    organizer;
    ticketTiers;
    registrations;
    createdAt;
    updatedAt;
};
exports.Event = Event;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rock in Rio Jakarta 2026' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'rock-in-rio-jakarta-2026' }),
    (0, typeorm_1.Column)({ type: 'varchar', unique: true, length: 280 }),
    __metadata("design:type", String)
], Event.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Festival konser musik rock terbesar tahun ini...' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-15T19:00:00.000Z' }),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-15T23:00:00.000Z' }),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Gelora Bung Karno, Jakarta' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    (0, typeorm_1.Column)({ type: 'int', default: 100 }),
    __metadata("design:type", Number)
], Event.prototype, "quota", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/file-12345.jpg' }),
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "bannerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isApproved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EventStatus, example: EventStatus.PUBLISHED }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.PUBLISHED,
    }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' }),
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Event.prototype, "organizerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_entity_1.User }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.events, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'organizerId' }),
    __metadata("design:type", user_entity_1.User)
], Event.prototype, "organizer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [ticket_tier_entity_1.TicketTier] }),
    (0, typeorm_1.OneToMany)(() => ticket_tier_entity_1.TicketTier, (tier) => tier.event, { cascade: true }),
    __metadata("design:type", Array)
], Event.prototype, "ticketTiers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [registration_entity_1.Registration] }),
    (0, typeorm_1.OneToMany)(() => registration_entity_1.Registration, (reg) => reg.event),
    __metadata("design:type", Array)
], Event.prototype, "registrations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05T09:16:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map