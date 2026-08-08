import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Registration } from './entities/registration.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @ApiTags('2. Pengunjung (User)')
  @Post()
  @ApiOperation({
    summary: 'Checkout / Beli Tiket Konser — User',
    description:
      'Lakukan pemesanan tiket konser. Upload bukti pembayaran dalam format file gambar menggunakan **multipart/form-data**.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['eventId'],
      properties: {
        eventId: { type: 'string', format: 'uuid', example: 'uuid-event-id' },
        ticketTierId: { type: 'string', format: 'uuid', example: 'uuid-ticket-tier-id' },
        quantity: { type: 'number', example: 1, default: 1 },
        paymentMethodId: { type: 'string', format: 'uuid', example: 'uuid-payment-method-id' },
        paymentProof: {
          type: 'string',
          format: 'binary',
          description: 'File bukti pembayaran (JPG, PNG, WEBP — maks 5MB)',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: Registration,
    description: 'Pesanan tiket berhasil dibuat',
  })
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Format bukti pembayaran tidak didukung (Gunakan JPG, PNG, atau WEBP)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  register(
    @Body() createRegistrationDto: CreateRegistrationDto,
    @GetUser() user: User,
    @UploadedFile() paymentProof?: Express.Multer.File,
  ) {
    return this.registrationsService.register(createRegistrationDto, user, paymentProof);
  }

  @ApiTags('2. Pengunjung (User)')
  @Get('my-tickets')
  @ApiOperation({ summary: 'Daftar Tiket yang Dimiliki — User' })
  @ApiOkResponse({
    type: [Registration],
    description: 'Daftar tiket milik pengguna',
  })
  findMyTickets(@GetUser() user: User) {
    return this.registrationsService.findMyTickets(user);
  }

  @ApiTags('3. Organizer')
  @Get('organizer/payments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Daftar Pembayaran Masuk dari Pembeli — Organizer' })
  @ApiOkResponse({
    type: [Registration],
    description: 'Daftar pembayaran masuk untuk event milik organizer',
  })
  findOrganizerPayments(@GetUser() user: User) {
    return this.registrationsService.findOrganizerPayments(user);
  }

  @ApiTags('3. Organizer')
  @Patch(':id/verify-payment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve / Reject Bukti Pembayaran — Organizer' })
  @ApiParam({
    name: 'id',
    description: 'ID Registrasi/Tiket yang ingin diverifikasi',
  })
  @ApiOkResponse({
    type: Registration,
    description: 'Status pembayaran berhasil diverifikasi',
  })
  verifyPayment(
    @Param('id') id: string,
    @Body() dto: VerifyPaymentDto,
    @GetUser() user: User,
  ) {
    return this.registrationsService.verifyPayment(id, dto, user);
  }

  @ApiTags('2. Pengunjung (User)')
  @Get(':id')
  @ApiOperation({ summary: 'Detail Tiket / Registrasi — User' })
  @ApiParam({ name: 'id', description: 'ID Registrasi/Tiket' })
  @ApiOkResponse({ type: Registration, description: 'Detail registrasi tiket' })
  findOne(@Param('id') id: string) {
    return this.registrationsService.findOne(id);
  }

  @ApiTags('2. Pengunjung (User)')
  @Get(':id/ticket-pdf')
  @ApiOperation({ summary: 'Download Tiket PDF + QR Code — User' })
  @ApiParam({ name: 'id', description: 'ID Registrasi/Tiket' })
  @ApiProduces('application/pdf')
  @ApiResponse({
    status: 200,
    description: 'File PDF Tiket Digital berhasil diunduh',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async downloadTicketPdf(
    @Param('id') id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.registrationsService.generateTicketPdf(
      id,
      user,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${id}.pdf`,
      'Content-Length': String(pdfBuffer.length),
    });
    res.end(pdfBuffer);
  }
}
