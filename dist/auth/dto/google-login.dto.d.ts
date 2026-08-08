import { UserRole } from '../../users/entities/user.entity';
export declare class GoogleLoginDto {
    token: string;
    name?: string;
    email?: string;
    role?: UserRole;
}
