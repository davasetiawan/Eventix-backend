import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import {
  Registration,
  RegistrationStatus,
} from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { TicketTier } from '../events/entities/ticket-tier.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
import {
  VerifyPaymentDto,
  PaymentVerifyAction,
} from './dto/verify-payment.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(TicketTier)
    private readonly ticketTierRepository: Repository<TicketTier>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private checkOrganizerVerification(user: User) {
    if (user.role === UserRole.ORGANIZER && !user.isVerified) {
      throw new ForbiddenException(
        'Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan tindakan ini.',
      );
    }
  }

  private generateTicketCode(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `EVTX-${Date.now().toString().slice(-6)}-${randomDigits}`;
  }

  async register(
    createDto: CreateRegistrationDto,
    user: User,
    paymentProof?: Express.Multer.File,
  ): Promise<Registration> {
    const event = await this.eventRepository.findOne({
      where: { id: createDto.eventId },
      relations: { ticketTiers: true },
    });

    if (!event) {
      throw new NotFoundException('Event tidak ditemukan');
    }

    let tier: TicketTier | null = null;
    if (createDto.ticketTierId) {
      tier = await this.ticketTierRepository.findOne({
        where: { id: createDto.ticketTierId },
      });
      if (!tier || tier.eventId !== event.id) {
        throw new BadRequestException(
          'Jenis tiket tidak valid untuk event ini',
        );
      }
    } else if (event.ticketTiers && event.ticketTiers.length > 0) {
      tier = event.ticketTiers[0];
    }

    const quantity = createDto.quantity || 1;
    const pricePerTicket = tier ? Number(tier.price) : Number(event.price || 0);

    if (tier) {
      if (tier.soldQuota + quantity > tier.quota) {
        throw new BadRequestException(
          'Kuota tiket untuk jenis ini telah habis atau tidak mencukupi',
        );
      }
    } else {
      const totalSold = await this.registrationRepository.count({
        where: { eventId: event.id },
      });
      if (totalSold + quantity > event.quota) {
        throw new BadRequestException(
          'Kuota event ini telah habis atau tidak mencukupi',
        );
      }
    }

    if (createDto.paymentMethodId) {
      const pm = await this.paymentMethodRepository.findOne({
        where: { id: createDto.paymentMethodId },
      });
      if (!pm) {
        throw new BadRequestException('Metode pembayaran tidak valid');
      }
    }

    const ticketCode = this.generateTicketCode();
    const totalPrice = pricePerTicket * quantity;
    const isFree = totalPrice === 0;
    let paymentProofUrl = createDto.paymentProofUrl;
    if (paymentProof) {
      const uploadResult = await this.cloudinaryService.uploadFile(paymentProof, 'eventix/payments');
      paymentProofUrl = uploadResult.secure_url;
    }

    const hasProof = !!paymentProofUrl;

    const registrationData: Partial<Registration> = {
      ticketCode,
      quantity,
      totalPrice,
      status: isFree
        ? RegistrationStatus.VERIFIED
        : hasProof
          ? RegistrationStatus.PAYMENT_SUBMITTED
          : RegistrationStatus.PENDING_PAYMENT,
      userId: user.id,
      eventId: event.id,
      ticketTierId: tier ? tier.id : undefined,
      paymentMethodId: createDto.paymentMethodId || undefined,
      paymentProofUrl: paymentProofUrl || undefined,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ticketCode)}`,
      verifiedAt: isFree ? new Date() : undefined,
    };

    const registration = this.registrationRepository.create(registrationData);

    if (tier) {
      tier.soldQuota += quantity;
      await this.ticketTierRepository.save(tier);
    }

    return this.registrationRepository.save(registration);
  }

  async uploadPaymentProof(
    id: string,
    dto: UploadPaymentProofDto,
    user: User,
  ): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!registration) {
      throw new NotFoundException('Tiket/Registrasi tidak ditemukan');
    }

    if (registration.userId !== user.id) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses ke registrasi ini',
      );
    }

    registration.paymentProofUrl = dto.paymentProofUrl;
    registration.status = RegistrationStatus.PAYMENT_SUBMITTED;
    return this.registrationRepository.save(registration);
  }

  async findOrganizerPayments(user: User): Promise<Registration[]> {
    this.checkOrganizerVerification(user);
    return this.registrationRepository.find({
      where: { event: { organizerId: user.id } },
      relations: {
        user: true,
        event: true,
        ticketTier: true,
        paymentMethod: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async verifyPayment(
    id: string,
    dto: VerifyPaymentDto,
    user: User,
  ): Promise<Registration> {
    this.checkOrganizerVerification(user);
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: { event: true },
    });

    if (!registration) {
      throw new NotFoundException('Registrasi tidak ditemukan');
    }

    if (
      user.role !== UserRole.ADMIN &&
      registration.event.organizerId !== user.id
    ) {
      throw new ForbiddenException(
        'Anda tidak memiliki izin untuk memverifikasi pembayaran ini',
      );
    }

    if (dto.action === PaymentVerifyAction.APPROVE) {
      registration.status = RegistrationStatus.VERIFIED;
      registration.verifiedAt = new Date();
    } else {
      registration.status = RegistrationStatus.REJECTED;
      registration.rejectionReason =
        dto.rejectionReason || 'Bukti pembayaran ditolak oleh organizer';
    }

    return this.registrationRepository.save(registration);
  }

  async findMyTickets(user: User): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { userId: user.id },
      relations: { event: true, ticketTier: true, paymentMethod: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: {
        user: true,
        event: true,
        ticketTier: true,
        paymentMethod: true,
      },
    });

    if (!registration) {
      throw new NotFoundException(
        `Registrasi/Tiket dengan ID "${id}" tidak ditemukan`,
      );
    }

    return registration;
  }

  async generateTicketPdf(id: string, user: User): Promise<Buffer> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: { user: true, event: true, ticketTier: true },
    });

    if (!registration) {
      throw new NotFoundException('Tiket tidak ditemukan');
    }

    if (
      registration.userId !== user.id &&
      user.role !== UserRole.ADMIN &&
      registration.event.organizerId !== user.id
    ) {
      throw new ForbiddenException('Anda tidak berhak mengunduh tiket ini');
    }

    if (registration.status !== RegistrationStatus.VERIFIED) {
      throw new BadRequestException(
        'Tiket belum diverifikasi / pembayaran belum disetujui',
      );
    }

    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Generate QR Code image buffer
        const qrDataUrl = await QRCode.toDataURL(registration.ticketCode);
        const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        const qrBuffer = Buffer.from(qrBase64, 'base64');

        // Header
        doc
          .fillColor('#4F46E5')
          .fontSize(22)
          .text('EVENTIX', { align: 'center' });
        doc
          .fillColor('#374151')
          .fontSize(14)
          .text('E-TICKET RESMI', { align: 'center' });
        doc.moveDown(1.5);

        // Box boundary
        doc.rect(40, 110, 515, 340).stroke('#E5E7EB');

        // Event Details
        doc
          .fillColor('#111827')
          .fontSize(18)
          .text(registration.event.title, 60, 130);
        doc
          .fontSize(11)
          .fillColor('#6B7280')
          .text(`Penyelenggara: Eventix Organizer`, 60, 155);

        doc.moveTo(60, 175).lineTo(535, 175).stroke('#E5E7EB');

        doc
          .fontSize(12)
          .fillColor('#374151')
          .text(
            `Jadwal: ${new Date(registration.event.startDate).toLocaleString('id-ID')}`,
            60,
            190,
          );
        doc.text(`Lokasi: ${registration.event.location}`, 60, 210);
        doc.text(
          `Jenis Tiket: ${registration.ticketTier?.name || 'Reguler'}`,
          60,
          230,
        );
        doc.text(`Jumlah: ${registration.quantity} Tiket`, 60, 250);
        doc.text(`Nama Pemegang: ${registration.user.name}`, 60, 270);
        doc.text(`Email: ${registration.user.email}`, 60, 290);
        doc.text(`Kode Tiket: ${registration.ticketCode}`, 60, 310);

        // Insert QR Code Image
        doc.image(qrBuffer, 380, 190, { width: 140, height: 140 });

        doc
          .fillColor('#10B981')
          .fontSize(12)
          .text('STATUS: VERIFIED / LUNAS', 60, 340);

        doc.moveTo(60, 375).lineTo(535, 375).stroke('#E5E7EB');
        doc
          .fontSize(10)
          .fillColor('#9CA3AF')
          .text(
            'Tunjukkan QR Code ini kepada petugas di lokasi event untuk verifikasi.',
            60,
            390,
            { align: 'center', width: 475 },
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
