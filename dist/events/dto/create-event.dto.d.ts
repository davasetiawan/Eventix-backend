import { EventStatus } from '../entities/event.entity';
import { CreateTicketTierDto } from './create-ticket-tier.dto';
export declare class CreateEventDto {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    price?: number;
    quota?: number;
    bannerUrl?: string;
    status?: EventStatus;
    ticketTiers?: CreateTicketTierDto[];
}
