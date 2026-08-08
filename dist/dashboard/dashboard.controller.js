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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const organizer_stats_response_dto_1 = require("./dto/organizer-stats-response.dto");
const admin_stats_response_dto_1 = require("./dto/admin-stats-response.dto");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOrganizerDashboard(user) {
        return this.dashboardService.getOrganizerStats(user);
    }
    getAdminDashboard() {
        return this.dashboardService.getAdminStats();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, swagger_1.ApiTags)('3. Organizer'),
    (0, common_1.Get)('organizer'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ORGANIZER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistik Organizer (Total Event, Tiket Terjual, Pendapatan)',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: organizer_stats_response_dto_1.OrganizerStatsResponseDto,
        description: 'Statistik dashboard untuk organizer',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOrganizerDashboard", null);
__decorate([
    (0, swagger_1.ApiTags)('4. Admin'),
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Statistik Platform (Total User, Event, Tiket, Revenue)',
    }),
    (0, swagger_1.ApiOkResponse)({
        type: admin_stats_response_dto_1.AdminStatsResponseDto,
        description: 'Statistik dashboard untuk platform admin',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getAdminDashboard", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map