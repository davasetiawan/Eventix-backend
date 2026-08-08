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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("./entities/user.entity");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll() {
        return this.usersService.findAll();
    }
    findAllOrganizers() {
        return this.usersService.findAllOrganizers();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    verifyOrganizer(id, isVerified) {
        const status = isVerified === undefined ? true : String(isVerified) === 'true';
        return this.usersService.verifyOrganizer(id, status);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiTags)('4. Admin'),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan Semua Daftar User (Admin)' }),
    (0, swagger_1.ApiOkResponse)({ type: [user_entity_1.User], description: 'Daftar semua pengguna' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiTags)('4. Admin'),
    (0, common_1.Get)('organizers'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan Daftar Semua Organizer (Admin)' }),
    (0, swagger_1.ApiOkResponse)({ type: [user_entity_1.User], description: 'Daftar semua akun Organizer' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAllOrganizers", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)', '3. Organizer'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan Detail User Berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID User' }),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.User, description: 'Detail profil pengguna' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)', '3. Organizer'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui Profil (Nama, Avatar, Telepon, Bio)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID User' }),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.User, description: 'Profil berhasil diperbarui' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiTags)('4. Admin'),
    (0, common_1.Patch)(':id/verify-organizer'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Verifikasi Akun Organizer (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID Organizer yang ingin diverifikasi' }),
    (0, swagger_1.ApiQuery)({ name: 'isVerified', required: false, type: Boolean }),
    (0, swagger_1.ApiOkResponse)({
        type: user_entity_1.User,
        description: 'Status verifikasi organizer berhasil diubah',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('isVerified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyOrganizer", null);
__decorate([
    (0, swagger_1.ApiTags)('4. Admin'),
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus User (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID User' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User berhasil dihapus dari database' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map