import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('1. Autentikasi')
  @Post('register')
  @ApiOperation({ summary: 'Registrasi Pengguna Baru (User / Organizer)' })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Registrasi Berhasil',
  })
  @ApiResponse({ status: 409, description: 'Email sudah terdaftar' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiTags('1. Autentikasi')
  @Post('login')
  @ApiOperation({ summary: 'Login Pengguna — Mendapatkan Token JWT' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Login Berhasil & Mendapatkan Token JWT',
  })
  @ApiResponse({ status: 401, description: 'Kredensial Tidak Valid' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiTags('1. Autentikasi')
  @Post('google')
  @ApiOperation({ summary: 'Login / Register dengan Google' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Login Google Berhasil',
  })
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  @ApiTags('1. Autentikasi')
  @Post('logout')
  @ApiOperation({ summary: 'Logout Pengguna' })
  @ApiOkResponse({ description: 'Logout berhasil' })
  logout() {
    return { message: 'Logout berhasil' };
  }

  @ApiTags('2. Pengunjung (User)', '3. Organizer')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mendapatkan Profil User / Organizer yang Sedang Login',
  })
  @ApiOkResponse({ type: User, description: 'Profil pengguna berhasil dimuat' })
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }
}
