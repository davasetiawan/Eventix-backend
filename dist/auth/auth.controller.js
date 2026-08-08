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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const google_login_dto_1 = require("./dto/google-login.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    googleLogin(dto) {
        return this.authService.googleLogin(dto);
    }
    logout() {
        return { message: 'Logout berhasil' };
    }
    getProfile(user) {
        return this.authService.getProfile(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiTags)('1. Autentikasi'),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrasi Pengguna Baru (User / Organizer)' }),
    (0, swagger_1.ApiCreatedResponse)({
        type: auth_response_dto_1.AuthResponseDto,
        description: 'Registrasi Berhasil',
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email sudah terdaftar' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiTags)('1. Autentikasi'),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login Pengguna — Mendapatkan Token JWT' }),
    (0, swagger_1.ApiOkResponse)({
        type: auth_response_dto_1.AuthResponseDto,
        description: 'Login Berhasil & Mendapatkan Token JWT',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kredensial Tidak Valid' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiTags)('1. Autentikasi'),
    (0, common_1.Post)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Login / Register dengan Google' }),
    (0, swagger_1.ApiOkResponse)({
        type: auth_response_dto_1.AuthResponseDto,
        description: 'Login Google Berhasil',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_login_dto_1.GoogleLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, swagger_1.ApiTags)('1. Autentikasi'),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout Pengguna' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Logout berhasil' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiTags)('2. Pengunjung (User)', '3. Organizer'),
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Mendapatkan Profil User / Organizer yang Sedang Login',
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_entity_1.User, description: 'Profil pengguna berhasil dimuat' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map