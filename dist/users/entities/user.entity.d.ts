import { Event } from '../../events/entities/event.entity';
import { Registration } from '../../registrations/entities/registration.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    ORGANIZER = "ORGANIZER",
    USER = "USER"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatarUrl: string;
    phoneNumber: string;
    isVerified: boolean;
    organizationName: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
    events: Event[];
    registrations: Registration[];
}
