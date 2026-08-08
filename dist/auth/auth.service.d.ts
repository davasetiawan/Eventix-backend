import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            avatarUrl: string;
            phoneNumber: string;
            isVerified: boolean;
            organizationName: string;
            bio: string;
            createdAt: Date;
            updatedAt: Date;
            events: import("../events/entities/event.entity").Event[];
            registrations: import("../registrations/entities/registration.entity").Registration[];
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            avatarUrl: string;
            phoneNumber: string;
            isVerified: boolean;
            organizationName: string;
            bio: string;
            createdAt: Date;
            updatedAt: Date;
            events: import("../events/entities/event.entity").Event[];
            registrations: import("../registrations/entities/registration.entity").Registration[];
        };
        accessToken: string;
    }>;
    googleLogin(dto: GoogleLoginDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            avatarUrl: string;
            phoneNumber: string;
            isVerified: boolean;
            organizationName: string;
            bio: string;
            createdAt: Date;
            updatedAt: Date;
            events: import("../events/entities/event.entity").Event[];
            registrations: import("../registrations/entities/registration.entity").Registration[];
        };
        accessToken: string;
    }>;
    getProfile(user: User): Promise<User>;
}
