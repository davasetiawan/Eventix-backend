import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Event } from './entities/event.entity';
import { TicketTier } from './entities/ticket-tier.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiTags('2. Pengunjung (User)')
  @Get()
  @ApiOperation({
    summary: 'Melihat Daftar Konser (Search) — Public',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Pencarian nama atau deskripsi konser',
  })
  @ApiOkResponse({
    type: [Event],
    description: 'Daftar konser berhasil didapatkan',
  })
  findAll(@Query('search') search?: string) {
    return this.eventsService.findAll(search);
  }

  @ApiTags('3. Organizer')
  @Get('my-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Melihat Daftar Konser Milik Organizer — Organizer',
  })
  @ApiOkResponse({
    type: [Event],
    description: 'Daftar konser milik organizer berhasil didapatkan',
  })
  findMyEvents(@GetUser() user: User) {
    return this.eventsService.findMyEvents(user);
  }

  @ApiTags('2. Pengunjung (User)')
  @Get(':id')
  @ApiOperation({ summary: 'Melihat Detail Konser Berdasarkan ID — Public' })
  @ApiParam({ name: 'id', description: 'ID Konser' })
  @ApiOkResponse({
    type: Event,
    description: 'Detail konser berhasil didapatkan',
  })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiTags('3. Organizer')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Membuat Konser Baru (Beserta Jenis Tiket Opsional) — Organizer',
    description:
      'Upload data konser dan banner/flyer dalam satu request menggunakan **multipart/form-data**.\n\n' +
      'Field `ticketTiers` dikirim sebagai **JSON string**, contoh:\n' +
      '`[{"name":"Reguler","price":50000,"quota":200},{"name":"VIP","price":150000,"quota":50}]`',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'startDate', 'endDate', 'location'],
      properties: {
        title: { type: 'string', example: 'Rock in Rio Jakarta 2026' },
        description: {
          type: 'string',
          example:
            'Festival konser musik rock terbesar tahun ini menghadirkan artis internasional.',
        },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-10-15T19:00:00.000Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-10-15T23:00:00.000Z',
        },
        location: {
          type: 'string',
          example: 'Gelora Bung Karno, Jakarta',
        },
        price: { type: 'number', example: 50000 },
        quota: { type: 'number', example: 200 },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
          example: 'PUBLISHED',
        },
        ticketTiers: {
          type: 'string',
          description:
            'JSON string array of ticket tiers, e.g. [{"name":"Reguler","price":50000,"quota":200}]',
          example: '[{"name":"Reguler","price":50000,"quota":200}]',
        },
        banner: {
          type: 'string',
          format: 'binary',
          description: 'File banner/flyer konser (JPG, PNG, WEBP — maks 5MB)',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: Event,
    description: 'Konser baru berhasil dibuat',
  })
  @UseInterceptors(
    FileInterceptor('banner', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Format banner tidak didukung (Gunakan JPG, PNG, atau WEBP)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Body() body: Record<string, any>,
    @GetUser() user: User,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    // Parse ticketTiers JSON string jika ada
    let createEventDto: CreateEventDto;
    try {
      createEventDto = body as CreateEventDto;
      if (body.ticketTiers && typeof body.ticketTiers === 'string') {
        createEventDto.ticketTiers = JSON.parse(body.ticketTiers);
      }
      if (body.price !== undefined)
        createEventDto.price = Number(body.price);
      if (body.quota !== undefined)
        createEventDto.quota = Number(body.quota);
    } catch {
      throw new BadRequestException(
        'Format field ticketTiers tidak valid, harus berupa JSON string array',
      );
    }

    return this.eventsService.create(createEventDto, user, banner);
  }

  @ApiTags('3. Organizer')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Memperbarui Data Konser — Organizer',
    description:
      'Update data konser. Kirim sebagai **multipart/form-data** jika ingin mengganti banner. ' +
      'Semua field bersifat opsional.',
  })
  @ApiParam({ name: 'id', description: 'ID Konser yang ingin diperbarui' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Rock in Rio Jakarta 2026' },
        description: { type: 'string' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        location: { type: 'string' },
        price: { type: 'number' },
        quota: { type: 'number' },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
        },
        banner: {
          type: 'string',
          format: 'binary',
          description: 'File banner/flyer konser baru (JPG, PNG, WEBP — maks 5MB)',
        },
      },
    },
  })
  @ApiOkResponse({
    type: Event,
    description: 'Data konser berhasil diperbarui',
  })
  @UseInterceptors(
    FileInterceptor('banner', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Format banner tidak didukung (Gunakan JPG, PNG, atau WEBP)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @GetUser() user: User,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    const updateEventDto: UpdateEventDto = { ...body } as UpdateEventDto;
    if (body.price !== undefined) updateEventDto.price = Number(body.price);
    if (body.quota !== undefined) updateEventDto.quota = Number(body.quota);

    return this.eventsService.update(id, updateEventDto, user, banner);
  }

  @ApiTags('4. Admin')
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve Konser agar Terbit Resmi — Admin' })
  @ApiParam({ name: 'id', description: 'ID Konser yang ingin di-approve' })
  @ApiOkResponse({
    type: Event,
    description: 'Konser berhasil di-approve dan diterbitkan',
  })
  approveEvent(@Param('id') id: string) {
    return this.eventsService.approveEvent(id);
  }

  @ApiTags('3. Organizer', '4. Admin')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus Konser — Organizer/Admin' })
  @ApiParam({ name: 'id', description: 'ID Konser yang ingin dihapus' })
  @ApiOkResponse({ description: 'Konser berhasil dihapus' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.eventsService.remove(id, user);
  }

  // --- Ticket Tiers ---

  @ApiTags('3. Organizer')
  @Post(':id/ticket-tiers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Menambah Jenis Tiket (VIP, Reguler, dll) — Organizer',
  })
  @ApiParam({ name: 'id', description: 'ID Konser' })
  @ApiCreatedResponse({
    type: TicketTier,
    description: 'Jenis tiket baru berhasil ditambahkan',
  })
  addTicketTier(
    @Param('id') eventId: string,
    @Body() dto: CreateTicketTierDto,
    @GetUser() user: User,
  ) {
    return this.eventsService.addTicketTier(eventId, dto, user);
  }

  @ApiTags('3. Organizer')
  @Patch('ticket-tiers/:tierId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Memperbarui Jenis Tiket (Harga/Kuota) — Organizer',
  })
  @ApiParam({ name: 'tierId', description: 'ID Jenis Tiket' })
  @ApiOkResponse({
    type: TicketTier,
    description: 'Jenis tiket berhasil diperbarui',
  })
  updateTicketTier(
    @Param('tierId') tierId: string,
    @Body() dto: UpdateTicketTierDto,
    @GetUser() user: User,
  ) {
    return this.eventsService.updateTicketTier(tierId, dto, user);
  }

  @ApiTags('3. Organizer')
  @Delete('ticket-tiers/:tierId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Menghapus Jenis Tiket — Organizer' })
  @ApiParam({
    name: 'tierId',
    description: 'ID Jenis Tiket yang ingin dihapus',
  })
  @ApiOkResponse({ description: 'Jenis tiket berhasil dihapus' })
  removeTicketTier(@Param('tierId') tierId: string, @GetUser() user: User) {
    return this.eventsService.removeTicketTier(tierId, user);
  }
}
