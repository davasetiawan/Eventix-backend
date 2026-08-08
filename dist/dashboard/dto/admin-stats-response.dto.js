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
exports.AdminStatsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AdminStatsResponseDto {
    totalUsers;
    totalOrganizers;
    totalEvents;
    totalTicketsSold;
    totalRevenue;
}
exports.AdminStatsResponseDto = AdminStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120 }),
    __metadata("design:type", Number)
], AdminStatsResponseDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], AdminStatsResponseDto.prototype, "totalOrganizers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 35 }),
    __metadata("design:type", Number)
], AdminStatsResponseDto.prototype, "totalEvents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 250 }),
    __metadata("design:type", Number)
], AdminStatsResponseDto.prototype, "totalTicketsSold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12500000 }),
    __metadata("design:type", Number)
], AdminStatsResponseDto.prototype, "totalRevenue", void 0);
//# sourceMappingURL=admin-stats-response.dto.js.map