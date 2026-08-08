import { DashboardService } from './dashboard.service';
import { User } from '../users/entities/user.entity';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOrganizerDashboard(user: User): Promise<{
        totalEvents: number;
        totalTicketsSold: number;
        totalRevenue: number;
    }>;
    getAdminDashboard(): Promise<{
        totalUsers: number;
        totalOrganizers: number;
        totalEvents: number;
        totalTicketsSold: number;
        totalRevenue: number;
    }>;
}
