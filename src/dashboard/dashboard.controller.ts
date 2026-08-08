import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { OrganizerStatsResponseDto } from './dto/organizer-stats-response.dto';
import { AdminStatsResponseDto } from './dto/admin-stats-response.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiTags('3. Organizer')
  @Get('organizer')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Statistik Organizer (Total Event, Tiket Terjual, Pendapatan)',
  })
  @ApiOkResponse({
    type: OrganizerStatsResponseDto,
    description: 'Statistik dashboard untuk organizer',
  })
  getOrganizerDashboard(@GetUser() user: User) {
    return this.dashboardService.getOrganizerStats(user);
  }

  @ApiTags('4. Admin')
  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Statistik Platform (Total User, Event, Tiket, Revenue)',
  })
  @ApiOkResponse({
    type: AdminStatsResponseDto,
    description: 'Statistik dashboard untuk platform admin',
  })
  getAdminDashboard() {
    return this.dashboardService.getAdminStats();
  }
}
