import { User } from '../../users/entities/user.entity';
export declare class AuthResponseDto {
    message: string;
    user: User;
    accessToken: string;
}
