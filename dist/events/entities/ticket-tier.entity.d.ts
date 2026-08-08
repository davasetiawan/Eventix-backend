import { Event } from './event.entity';
export declare class TicketTier {
    id: string;
    name: string;
    price: number;
    quota: number;
    soldQuota: number;
    eventId: string;
    event: Event;
    createdAt: Date;
    updatedAt: Date;
}
