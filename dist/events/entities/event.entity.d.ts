import { User } from '../../users/entities/user.entity';
import { Registration } from '../../registrations/entities/registration.entity';
import { TicketTier } from './ticket-tier.entity';
export declare enum EventStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare class Event {
    id: string;
    title: string;
    slug: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    price: number;
    quota: number;
    bannerUrl: string;
    isApproved: boolean;
    status: EventStatus;
    organizerId: string;
    organizer: User;
    ticketTiers: TicketTier[];
    registrations: Registration[];
    createdAt: Date;
    updatedAt: Date;
}
