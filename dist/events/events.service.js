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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
const ticket_tier_entity_1 = require("./entities/ticket-tier.entity");
const user_entity_1 = require("../users/entities/user.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let EventsService = class EventsService {
    eventRepository;
    ticketTierRepository;
    cloudinaryService;
    constructor(eventRepository, ticketTierRepository, cloudinaryService) {
        this.eventRepository = eventRepository;
        this.ticketTierRepository = ticketTierRepository;
        this.cloudinaryService = cloudinaryService;
    }
    checkOrganizerVerification(user) {
        if (user.role === user_entity_1.UserRole.ORGANIZER && !user.isVerified) {
            throw new common_1.ForbiddenException('Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan tindakan ini.');
        }
    }
    generateSlug(title) {
        const baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }
    async create(createEventDto, organizer, banner) {
        this.checkOrganizerVerification(organizer);
        const slug = this.generateSlug(createEventDto.title);
        let bannerUrl = createEventDto.bannerUrl;
        if (banner) {
            const uploadResult = await this.cloudinaryService.uploadFile(banner, 'eventix/banners');
            bannerUrl = uploadResult.secure_url;
        }
        const { ticketTiers, ...eventInfo } = createEventDto;
        const eventData = {
            ...eventInfo,
            slug,
            organizerId: organizer.id,
            startDate: new Date(createEventDto.startDate),
            endDate: new Date(createEventDto.endDate),
            isApproved: organizer.role === user_entity_1.UserRole.ADMIN,
        };
        if (bannerUrl) {
            eventData.bannerUrl = bannerUrl;
        }
        const event = this.eventRepository.create(eventData);
        const savedEvent = await this.eventRepository.save(event);
        if (createEventDto.ticketTiers && createEventDto.ticketTiers.length > 0) {
            for (const tierDto of createEventDto.ticketTiers) {
                const tier = this.ticketTierRepository.create({
                    ...tierDto,
                    eventId: savedEvent.id,
                });
                await this.ticketTierRepository.save(tier);
            }
        }
        else if (createEventDto.price !== undefined ||
            createEventDto.quota !== undefined) {
            const defaultTier = this.ticketTierRepository.create({
                name: 'Reguler',
                price: createEventDto.price || 0,
                quota: createEventDto.quota || 100,
                eventId: savedEvent.id,
            });
            await this.ticketTierRepository.save(defaultTier);
        }
        return this.findOne(savedEvent.id);
    }
    async findAll(search) {
        const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.organizer', 'organizer')
            .leftJoinAndSelect('event.ticketTiers', 'ticketTiers')
            .select([
            'event',
            'organizer.id',
            'organizer.name',
            'organizer.email',
            'organizer.avatarUrl',
            'ticketTiers',
        ]);
        if (search) {
            query.andWhere('(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))', { search: `%${search}%` });
        }
        return query.orderBy('event.startDate', 'ASC').getMany();
    }
    async findMyEvents(user) {
        this.checkOrganizerVerification(user);
        return this.eventRepository.find({
            where: { organizerId: user.id },
            relations: { ticketTiers: true, registrations: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: {
                organizer: true,
                ticketTiers: true,
                registrations: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event dengan ID "${id}" tidak ditemukan`);
        }
        return event;
    }
    async update(id, updateEventDto, user, banner) {
        this.checkOrganizerVerification(user);
        const event = await this.findOne(id);
        if (user.role !== user_entity_1.UserRole.ADMIN && event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin untuk mengedit event ini');
        }
        if (banner) {
            const uploadResult = await this.cloudinaryService.uploadFile(banner, 'eventix/banners');
            updateEventDto.bannerUrl = uploadResult.secure_url;
        }
        if (updateEventDto.startDate) {
            updateEventDto.startDate = new Date(updateEventDto.startDate);
        }
        if (updateEventDto.endDate) {
            updateEventDto.endDate = new Date(updateEventDto.endDate);
        }
        Object.assign(event, updateEventDto);
        return this.eventRepository.save(event);
    }
    async approveEvent(id) {
        const event = await this.findOne(id);
        event.isApproved = true;
        return this.eventRepository.save(event);
    }
    async remove(id, user) {
        this.checkOrganizerVerification(user);
        const event = await this.findOne(id);
        if (user.role !== user_entity_1.UserRole.ADMIN && event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin untuk menghapus event ini');
        }
        await this.eventRepository.remove(event);
        return { message: `Event "${event.title}" berhasil dihapus` };
    }
    async addTicketTier(eventId, dto, user) {
        this.checkOrganizerVerification(user);
        const event = await this.findOne(eventId);
        if (user.role !== user_entity_1.UserRole.ADMIN && event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk menambah tiket pada event ini');
        }
        const tier = this.ticketTierRepository.create({
            ...dto,
            eventId,
        });
        return this.ticketTierRepository.save(tier);
    }
    async updateTicketTier(tierId, dto, user) {
        this.checkOrganizerVerification(user);
        const tier = await this.ticketTierRepository.findOne({
            where: { id: tierId },
            relations: { event: true },
        });
        if (!tier) {
            throw new common_1.NotFoundException('Jenis tiket tidak ditemukan');
        }
        if (user.role !== user_entity_1.UserRole.ADMIN && tier.event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk mengubah jenis tiket ini');
        }
        Object.assign(tier, dto);
        return this.ticketTierRepository.save(tier);
    }
    async removeTicketTier(tierId, user) {
        this.checkOrganizerVerification(user);
        const tier = await this.ticketTierRepository.findOne({
            where: { id: tierId },
            relations: { event: true },
        });
        if (!tier) {
            throw new common_1.NotFoundException('Jenis tiket tidak ditemukan');
        }
        if (user.role !== user_entity_1.UserRole.ADMIN && tier.event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk menghapus jenis tiket ini');
        }
        await this.ticketTierRepository.remove(tier);
        return { message: 'Jenis tiket berhasil dihapus' };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_tier_entity_1.TicketTier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], EventsService);
//# sourceMappingURL=events.service.js.map