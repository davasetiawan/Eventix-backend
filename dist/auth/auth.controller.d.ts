import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
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
            role: import("../users/entities/user.entity").UserRole;
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
            role: import("../users/entities/user.entity").UserRole;
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
    logout(): {
        message: string;
    };
    getProfile(user: User): Promise<User>;
}
