import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/entities/event.entity';
import {
  Registration,
  RegistrationStatus,
} from '../registrations/entities/registration.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getOrganizerStats(organizer: User) {
    const totalEvents = await this.eventRepository.count({
      where: { organizerId: organizer.id },
    });

    const verifiedRegistrations = await this.registrationRepository.find({
      where: {
        event: { organizerId: organizer.id },
        status: RegistrationStatus.VERIFIED,
      },
    });

    const totalTicketsSold = verifiedRegistrations.reduce(
      (sum, reg) => sum + reg.quantity,
      0,
    );
    const totalRevenue = verifiedRegistrations.reduce(
      (sum, reg) => sum + Number(reg.totalPrice),
      0,
    );

    return {
      totalEvents,
      totalTicketsSold,
      totalRevenue,
    };
  }

  async getAdminStats() {
    const totalUsers = await this.userRepository.count({
      where: { role: UserRole.USER },
    });
    const totalOrganizers = await this.userRepository.count({
      where: { role: UserRole.ORGANIZER },
    });
    const totalEvents = await this.eventRepository.count();

    const verifiedRegistrations = await this.registrationRepository.find({
      where: { status: RegistrationStatus.VERIFIED },
    });

    const totalTicketsSold = verifiedRegistrations.reduce(
      (sum, reg) => sum + reg.quantity,
      0,
    );
    const totalRevenue = verifiedRegistrations.reduce(
      (sum, reg) => sum + Number(reg.totalPrice),
      0,
    );

    return {
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTicketsSold,
      totalRevenue,
    };
  }
}
