import { Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import { Registration } from '../registrations/entities/registration.entity';
import { User } from '../users/entities/user.entity';
export declare class DashboardService {
    private readonly eventRepository;
    private readonly registrationRepository;
    private readonly userRepository;
    constructor(eventRepository: Repository<Event>, registrationRepository: Repository<Registration>, userRepository: Repository<User>);
    getOrganizerStats(organizer: User): Promise<{
        totalEvents: number;
        totalTicketsSold: number;
        totalRevenue: number;
    }>;
    getAdminStats(): Promise<{
        totalUsers: number;
        totalOrganizers: number;
        totalEvents: number;
        totalTicketsSold: number;
        totalRevenue: number;
    }>;
}
