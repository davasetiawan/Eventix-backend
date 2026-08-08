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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../events/entities/event.entity");
const registration_entity_1 = require("../registrations/entities/registration.entity");
const user_entity_1 = require("../users/entities/user.entity");
let DashboardService = class DashboardService {
    eventRepository;
    registrationRepository;
    userRepository;
    constructor(eventRepository, registrationRepository, userRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
    }
    async getOrganizerStats(organizer) {
        const totalEvents = await this.eventRepository.count({
            where: { organizerId: organizer.id },
        });
        const verifiedRegistrations = await this.registrationRepository.find({
            where: {
                event: { organizerId: organizer.id },
                status: registration_entity_1.RegistrationStatus.VERIFIED,
            },
        });
        const totalTicketsSold = verifiedRegistrations.reduce((sum, reg) => sum + reg.quantity, 0);
        const totalRevenue = verifiedRegistrations.reduce((sum, reg) => sum + Number(reg.totalPrice), 0);
        return {
            totalEvents,
            totalTicketsSold,
            totalRevenue,
        };
    }
    async getAdminStats() {
        const totalUsers = await this.userRepository.count({
            where: { role: user_entity_1.UserRole.USER },
        });
        const totalOrganizers = await this.userRepository.count({
            where: { role: user_entity_1.UserRole.ORGANIZER },
        });
        const totalEvents = await this.eventRepository.count();
        const verifiedRegistrations = await this.registrationRepository.find({
            where: { status: registration_entity_1.RegistrationStatus.VERIFIED },
        });
        const totalTicketsSold = verifiedRegistrations.reduce((sum, reg) => sum + reg.quantity, 0);
        const totalRevenue = verifiedRegistrations.reduce((sum, reg) => sum + Number(reg.totalPrice), 0);
        return {
            totalUsers,
            totalOrganizers,
            totalEvents,
            totalTicketsSold,
            totalRevenue,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map