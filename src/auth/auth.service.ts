import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, role, phoneNumber } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email sudah terdaftar. Silakan gunakan email lain.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
      phoneNumber,
      isVerified: role === UserRole.USER, // Regular users are default verified, organizers need admin verification if desired
    });

    await this.userRepository.save(newUser);

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...userResult } = newUser;
    return {
      message: 'Registrasi berhasil',
      user: userResult,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...userResult } = user;
    return {
      message: 'Login berhasil',
      user: userResult,
      accessToken,
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    // Determine email & name from dto (or token payload)
    const email = dto.email || `google_user_${Date.now()}@eventix.com`;
    const name = dto.name || 'Pengguna Google';

    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = this.userRepository.create({
        name,
        email,
        password: dummyPassword,
        role: dto.role || UserRole.USER,
        isVerified: true,
      });
      await this.userRepository.save(user);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...userResult } = user;
    return {
      message: 'Login Google berhasil',
      user: userResult,
      accessToken,
    };
  }

  async getProfile(user: User) {
    return user;
  }
}
