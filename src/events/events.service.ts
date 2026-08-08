import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { TicketTier } from './entities/ticket-tier.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(TicketTier)
    private ticketTierRepository: Repository<TicketTier>,
    private cloudinaryService: CloudinaryService,
  ) {}

  private checkOrganizerVerification(user: User) {
    if (user.role === UserRole.ORGANIZER && !user.isVerified) {
      throw new ForbiddenException(
        'Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan tindakan ini.',
      );
    }
  }

  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  async create(
    createEventDto: CreateEventDto,
    organizer: User,
    banner?: Express.Multer.File,
  ) {
    this.checkOrganizerVerification(organizer);
    const slug = this.generateSlug(createEventDto.title);
    let bannerUrl = createEventDto.bannerUrl;
    if (banner) {
      const uploadResult = await this.cloudinaryService.uploadFile(banner, 'eventix/banners');
      bannerUrl = uploadResult.secure_url;
    }
    const { ticketTiers, ...eventInfo } = createEventDto;
    const eventData: Partial<Event> = {
      ...eventInfo,
      slug,
      organizerId: organizer.id,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      isApproved: organizer.role === UserRole.ADMIN,
    };
    if (bannerUrl) {
      eventData.bannerUrl = bannerUrl;
    }
    const event = this.eventRepository.create(eventData);
    const savedEvent = await this.eventRepository.save(event);

    // Create ticket tiers if provided in dto, otherwise fallback to default tier
    if (createEventDto.ticketTiers && createEventDto.ticketTiers.length > 0) {
      for (const tierDto of createEventDto.ticketTiers) {
        const tier = this.ticketTierRepository.create({
          ...tierDto,
          eventId: savedEvent.id,
        });
        await this.ticketTierRepository.save(tier);
      }
    } else if (
      createEventDto.price !== undefined ||
      createEventDto.quota !== undefined
    ) {
      const defaultTier = this.ticketTierRepository.create({
        name: 'Reguler',
        price: createEventDto.price || 0,
        quota: createEventDto.quota || 100,
        eventId: savedEvent.id,
      });
      await this.ticketTierRepository.save(defaultTier);
    }

    return this.findOne(savedEvent.id);
  }

  async findAll(search?: string) {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.ticketTiers', 'ticketTiers')
      .select([
        'event',
        'organizer.id',
        'organizer.name',
        'organizer.email',
        'organizer.avatarUrl',
        'ticketTiers',
      ]);

    if (search) {
      query.andWhere(
        '(LOWER(event.title) LIKE LOWER(:search) OR LOWER(event.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.orderBy('event.startDate', 'ASC').getMany();
  }

  async findMyEvents(user: User) {
    this.checkOrganizerVerification(user);
    return this.eventRepository.find({
      where: { organizerId: user.id },
      relations: { ticketTiers: true, registrations: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        organizer: true,
        ticketTiers: true,
        registrations: true,
      },
    });
    if (!event) {
      throw new NotFoundException(`Event dengan ID "${id}" tidak ditemukan`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: User, banner?: Express.Multer.File) {
    this.checkOrganizerVerification(user);
    const event = await this.findOne(id);

    if (user.role !== UserRole.ADMIN && event.organizerId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki izin untuk mengedit event ini',
      );
    }

    if (banner) {
      const uploadResult = await this.cloudinaryService.uploadFile(banner, 'eventix/banners');
      updateEventDto.bannerUrl = uploadResult.secure_url;
    }

    if (updateEventDto.startDate) {
      updateEventDto.startDate = new Date(updateEventDto.startDate) as any;
    }
    if (updateEventDto.endDate) {
      updateEventDto.endDate = new Date(updateEventDto.endDate) as any;
    }

    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async approveEvent(id: string) {
    const event = await this.findOne(id);
    event.isApproved = true;
    return this.eventRepository.save(event);
  }

  async remove(id: string, user: User) {
    this.checkOrganizerVerification(user);
    const event = await this.findOne(id);

    if (user.role !== UserRole.ADMIN && event.organizerId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki izin untuk menghapus event ini',
      );
    }

    await this.eventRepository.remove(event);
    return { message: `Event "${event.title}" berhasil dihapus` };
  }

  // --- Ticket Tier Management ---

  async addTicketTier(eventId: string, dto: CreateTicketTierDto, user: User) {
    this.checkOrganizerVerification(user);
    const event = await this.findOne(eventId);
    if (user.role !== UserRole.ADMIN && event.organizerId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk menambah tiket pada event ini',
      );
    }

    const tier = this.ticketTierRepository.create({
      ...dto,
      eventId,
    });
    return this.ticketTierRepository.save(tier);
  }

  async updateTicketTier(tierId: string, dto: UpdateTicketTierDto, user: User) {
    this.checkOrganizerVerification(user);
    const tier = await this.ticketTierRepository.findOne({
      where: { id: tierId },
      relations: { event: true },
    });
    if (!tier) {
      throw new NotFoundException('Jenis tiket tidak ditemukan');
    }

    if (user.role !== UserRole.ADMIN && tier.event.organizerId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk mengubah jenis tiket ini',
      );
    }

    Object.assign(tier, dto);
    return this.ticketTierRepository.save(tier);
  }

  async removeTicketTier(tierId: string, user: User) {
    this.checkOrganizerVerification(user);
    const tier = await this.ticketTierRepository.findOne({
      where: { id: tierId },
      relations: { event: true },
    });
    if (!tier) {
      throw new NotFoundException('Jenis tiket tidak ditemukan');
    }

    if (user.role !== UserRole.ADMIN && tier.event.organizerId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk menghapus jenis tiket ini',
      );
    }

    await this.ticketTierRepository.remove(tier);
    return { message: 'Jenis tiket berhasil dihapus' };
  }
}
