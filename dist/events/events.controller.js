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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const events_service_1 = require("./events.service");
const create_ticket_tier_dto_1 = require("./dto/create-ticket-tier.dto");
const update_ticket_tier_dto_1 = require("./dto/update-ticket-tier.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const event_entity_1 = require("./entities/event.entity");
const ticket_tier_entity_1 = require("./entities/ticket-tier.entity");
let EventsController = class EventsController {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    findAll(search) {
        return this.eventsService.findAll(search);
    }
    findMyEvents(user) {
        return this.eventsService.findMyEvents(user);
    }
    findOne(id) {
        return this.eventsService.findOne(id);
    }
    create(body, user, banner) {
        let createEventDto;
        try {
            createEventDto = body;
            if (body.ticketTiers && typeof body.ticketTiers === 'string') {
                createEventDto.ticketTiers = JSON.parse(body.ticketTiers);
            }
            if (body.price !== undefined)
                createEventDto.price = Number(body.price);
            if (body.quota !== undefined)
                createEventDto.quota = Number(body.quota);
        }
        catch {
            throw new common_1.BadRequestException('Format field ticketTiers tidak valid, harus berupa JSON string array');
        }
        return this.eventsService.create(createEventDto, user, banner);
    }
    update(id, body, user, banner) {
        const updateEventDto = { ...body };
        if (body.price !== undefined)
            updateEventDto.price = Number(body.price);
        if (body.quota !== undefined)
            updateEventDto.quota = Number(body.quota);
        return this.eventsService.update(id, updateEventDto, user, banner);
    }
    approveEvent(id) {
        return this.eventsService.approveEvent(id);
    }
    remove(id, user) {
        return this.eventsService.remove(id, user);
    }
    addTicketTier(eventId, dto, user) {
        return this.eventsService.addTicketTier(eventId, dto, user);
    }
    updateTicketTier(tierId, dto, user) {
        return this.eventsService.updateTicketTier(tierId, dto, user);
    }
    removeTicketTier(tierId, user) {
        return this.eventsService.removeTicketTier(tierId, user);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Melihat Daftar Konser (Search) — Public',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Pencarian nama atau deskripsi konser',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: [event_entity_1.Event],
        description: 'Daftar konser berhasil didapatkan',
    }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Get)('my-events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Melihat Daftar Konser Milik Organizer — Organizer',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: [event_entity_1.Event],
        description: 'Daftar konser milik organizer berhasil didapatkan',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findMyEvents", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Melihat Detail Konser Berdasarkan ID — Public' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Konser' }),
    (0, swagger_1.ApiOkResponse)({
        type: event_entity_1.Event,
        description: 'Detail konser berhasil didapatkan',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Membuat Konser Baru (Beserta Jenis Tiket Opsional) — Organizer',
        description: 'Upload data konser dan banner/flyer dalam satu request menggunakan **multipart/form-data**.\n\n' +
            'Field `ticketTiers` dikirim sebagai **JSON string**, contoh:\n' +
            '`[{"name":"Reguler","price":50000,"quota":200},{"name":"VIP","price":150000,"quota":50}]`',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['title', 'description', 'startDate', 'endDate', 'location'],
            properties: {
                title: { type: 'string', example: 'Rock in Rio Jakarta 2026' },
                description: {
                    type: 'string',
                    example: 'Festival konser musik rock terbesar tahun ini menghadirkan artis internasional.',
                },
                startDate: {
                    type: 'string',
                    format: 'date-time',
                    example: '2026-10-15T19:00:00.000Z',
                },
                endDate: {
                    type: 'string',
                    format: 'date-time',
                    example: '2026-10-15T23:00:00.000Z',
                },
                location: {
                    type: 'string',
                    example: 'Gelora Bung Karno, Jakarta',
                },
                price: { type: 'number', example: 50000 },
                quota: { type: 'number', example: 200 },
                status: {
                    type: 'string',
                    enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
                    example: 'PUBLISHED',
                },
                ticketTiers: {
                    type: 'string',
                    description: 'JSON string array of ticket tiers, e.g. [{"name":"Reguler","price":50000,"quota":200}]',
                    example: '[{"name":"Reguler","price":50000,"quota":200}]',
                },
                banner: {
                    type: 'string',
                    format: 'binary',
                    description: 'File banner/flyer konser (JPG, PNG, WEBP — maks 5MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: event_entity_1.Event,
        description: 'Konser baru berhasil dibuat',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('banner', {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new common_1.BadRequestException('Format banner tidak didukung (Gunakan JPG, PNG, atau WEBP)'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Memperbarui Data Konser — Organizer',
        description: 'Update data konser. Kirim sebagai **multipart/form-data** jika ingin mengganti banner. ' +
            'Semua field bersifat opsional.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Konser yang ingin diperbarui' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Rock in Rio Jakarta 2026' },
                description: { type: 'string' },
                startDate: { type: 'string', format: 'date-time' },
                endDate: { type: 'string', format: 'date-time' },
                location: { type: 'string' },
                price: { type: 'number' },
                quota: { type: 'number' },
                status: {
                    type: 'string',
                    enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
                },
                banner: {
                    type: 'string',
                    format: 'binary',
                    description: 'File banner/flyer konser baru (JPG, PNG, WEBP — maks 5MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        type: event_entity_1.Event,
        description: 'Data konser berhasil diperbarui',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('banner', {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new common_1.BadRequestException('Format banner tidak didukung (Gunakan JPG, PNG, atau WEBP)'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_entity_1.User, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiTags)('4. Admin'),
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve Konser agar Terbit Resmi — Admin' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Konser yang ingin di-approve' }),
    (0, swagger_1.ApiOkResponse)({
        type: event_entity_1.Event,
        description: 'Konser berhasil di-approve dan diterbitkan',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "approveEvent", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer', '4. Admin'),
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus Konser — Organizer/Admin' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Konser yang ingin dihapus' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Konser berhasil dihapus' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Post)(':id/ticket-tiers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Menambah Jenis Tiket (VIP, Reguler, dll) — Organizer',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Konser' }),
    (0, swagger_1.ApiCreatedResponse)({
        type: ticket_tier_entity_1.TicketTier,
        description: 'Jenis tiket baru berhasil ditambahkan',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ticket_tier_dto_1.CreateTicketTierDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "addTicketTier", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Patch)('ticket-tiers/:tierId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Memperbarui Jenis Tiket (Harga/Kuota) — Organizer',
    }),
    (0, swagger_1.ApiParam)({ name: 'tierId', description: 'ID Jenis Tiket' }),
    (0, swagger_1.ApiOkResponse)({
        type: ticket_tier_entity_1.TicketTier,
        description: 'Jenis tiket berhasil diperbarui',
    }),
    __param(0, (0, common_1.Param)('tierId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_tier_dto_1.UpdateTicketTierDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "updateTicketTier", null);
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Delete)('ticket-tiers/:tierId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus Jenis Tiket — Organizer' }),
    (0, swagger_1.ApiParam)({
        name: 'tierId',
        description: 'ID Jenis Tiket yang ingin dihapus',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Jenis tiket berhasil dihapus' }),
    __param(0, (0, common_1.Param)('tierId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "removeTicketTier", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map