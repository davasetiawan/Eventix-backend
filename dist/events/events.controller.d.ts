import { EventsService } from './events.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { User } from '../users/entities/user.entity';
import { Event } from './entities/event.entity';
import { TicketTier } from './entities/ticket-tier.entity';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(search?: string): Promise<Event[]>;
    findMyEvents(user: User): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    create(body: Record<string, any>, user: User, banner?: Express.Multer.File): Promise<Event>;
    update(id: string, body: Record<string, any>, user: User, banner?: Express.Multer.File): Promise<Event>;
    approveEvent(id: string): Promise<Event>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    addTicketTier(eventId: string, dto: CreateTicketTierDto, user: User): Promise<TicketTier>;
    updateTicketTier(tierId: string, dto: UpdateTicketTierDto, user: User): Promise<TicketTier>;
    removeTicketTier(tierId: string, user: User): Promise<{
        message: string;
    }>;
}
