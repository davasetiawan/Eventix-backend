import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { TicketTier } from './entities/ticket-tier.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { User } from '../users/entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class EventsService {
    private eventRepository;
    private ticketTierRepository;
    private cloudinaryService;
    constructor(eventRepository: Repository<Event>, ticketTierRepository: Repository<TicketTier>, cloudinaryService: CloudinaryService);
    private checkOrganizerVerification;
    private generateSlug;
    create(createEventDto: CreateEventDto, organizer: User, banner?: Express.Multer.File): Promise<Event>;
    findAll(search?: string): Promise<Event[]>;
    findMyEvents(user: User): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto, user: User, banner?: Express.Multer.File): Promise<Event>;
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
