"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const QRCode = __importStar(require("qrcode"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const registration_entity_1 = require("./entities/registration.entity");
const event_entity_1 = require("../events/entities/event.entity");
const ticket_tier_entity_1 = require("../events/entities/ticket-tier.entity");
const payment_method_entity_1 = require("../payment-methods/entities/payment-method.entity");
const verify_payment_dto_1 = require("./dto/verify-payment.dto");
const user_entity_1 = require("../users/entities/user.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let RegistrationsService = class RegistrationsService {
    registrationRepository;
    eventRepository;
    ticketTierRepository;
    paymentMethodRepository;
    cloudinaryService;
    constructor(registrationRepository, eventRepository, ticketTierRepository, paymentMethodRepository, cloudinaryService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.ticketTierRepository = ticketTierRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.cloudinaryService = cloudinaryService;
    }
    checkOrganizerVerification(user) {
        if (user.role === user_entity_1.UserRole.ORGANIZER && !user.isVerified) {
            throw new common_1.ForbiddenException('Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan tindakan ini.');
        }
    }
    generateTicketCode() {
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        return `EVTX-${Date.now().toString().slice(-6)}-${randomDigits}`;
    }
    async register(createDto, user, paymentProof) {
        const event = await this.eventRepository.findOne({
            where: { id: createDto.eventId },
            relations: { ticketTiers: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Event tidak ditemukan');
        }
        let tier = null;
        if (createDto.ticketTierId) {
            tier = await this.ticketTierRepository.findOne({
                where: { id: createDto.ticketTierId },
            });
            if (!tier || tier.eventId !== event.id) {
                throw new common_1.BadRequestException('Jenis tiket tidak valid untuk event ini');
            }
        }
        else if (event.ticketTiers && event.ticketTiers.length > 0) {
            tier = event.ticketTiers[0];
        }
        const quantity = createDto.quantity || 1;
        const pricePerTicket = tier ? Number(tier.price) : Number(event.price || 0);
        if (tier) {
            if (tier.soldQuota + quantity > tier.quota) {
                throw new common_1.BadRequestException('Kuota tiket untuk jenis ini telah habis atau tidak mencukupi');
            }
        }
        else {
            const totalSold = await this.registrationRepository.count({
                where: { eventId: event.id },
            });
            if (totalSold + quantity > event.quota) {
                throw new common_1.BadRequestException('Kuota event ini telah habis atau tidak mencukupi');
            }
        }
        if (createDto.paymentMethodId) {
            const pm = await this.paymentMethodRepository.findOne({
                where: { id: createDto.paymentMethodId },
            });
            if (!pm) {
                throw new common_1.BadRequestException('Metode pembayaran tidak valid');
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
        const registrationData = {
            ticketCode,
            quantity,
            totalPrice,
            status: isFree
                ? registration_entity_1.RegistrationStatus.VERIFIED
                : hasProof
                    ? registration_entity_1.RegistrationStatus.PAYMENT_SUBMITTED
                    : registration_entity_1.RegistrationStatus.PENDING_PAYMENT,
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
    async uploadPaymentProof(id, dto, user) {
        const registration = await this.registrationRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!registration) {
            throw new common_1.NotFoundException('Tiket/Registrasi tidak ditemukan');
        }
        if (registration.userId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke registrasi ini');
        }
        registration.paymentProofUrl = dto.paymentProofUrl;
        registration.status = registration_entity_1.RegistrationStatus.PAYMENT_SUBMITTED;
        return this.registrationRepository.save(registration);
    }
    async findOrganizerPayments(user) {
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
    async verifyPayment(id, dto, user) {
        this.checkOrganizerVerification(user);
        const registration = await this.registrationRepository.findOne({
            where: { id },
            relations: { event: true },
        });
        if (!registration) {
            throw new common_1.NotFoundException('Registrasi tidak ditemukan');
        }
        if (user.role !== user_entity_1.UserRole.ADMIN &&
            registration.event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin untuk memverifikasi pembayaran ini');
        }
        if (dto.action === verify_payment_dto_1.PaymentVerifyAction.APPROVE) {
            registration.status = registration_entity_1.RegistrationStatus.VERIFIED;
            registration.verifiedAt = new Date();
        }
        else {
            registration.status = registration_entity_1.RegistrationStatus.REJECTED;
            registration.rejectionReason =
                dto.rejectionReason || 'Bukti pembayaran ditolak oleh organizer';
        }
        return this.registrationRepository.save(registration);
    }
    async findMyTickets(user) {
        return this.registrationRepository.find({
            where: { userId: user.id },
            relations: { event: true, ticketTier: true, paymentMethod: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Registrasi/Tiket dengan ID "${id}" tidak ditemukan`);
        }
        return registration;
    }
    async generateTicketPdf(id, user) {
        const registration = await this.registrationRepository.findOne({
            where: { id },
            relations: { user: true, event: true, ticketTier: true },
        });
        if (!registration) {
            throw new common_1.NotFoundException('Tiket tidak ditemukan');
        }
        if (registration.userId !== user.id &&
            user.role !== user_entity_1.UserRole.ADMIN &&
            registration.event.organizerId !== user.id) {
            throw new common_1.ForbiddenException('Anda tidak berhak mengunduh tiket ini');
        }
        if (registration.status !== registration_entity_1.RegistrationStatus.VERIFIED) {
            throw new common_1.BadRequestException('Tiket belum diverifikasi / pembayaran belum disetujui');
        }
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                const qrDataUrl = await QRCode.toDataURL(registration.ticketCode);
                const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
                const qrBuffer = Buffer.from(qrBase64, 'base64');
                doc
                    .fillColor('#4F46E5')
                    .fontSize(22)
                    .text('EVENTIX', { align: 'center' });
                doc
                    .fillColor('#374151')
                    .fontSize(14)
                    .text('E-TICKET RESMI', { align: 'center' });
                doc.moveDown(1.5);
                doc.rect(40, 110, 515, 340).stroke('#E5E7EB');
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
                    .text(`Jadwal: ${new Date(registration.event.startDate).toLocaleString('id-ID')}`, 60, 190);
                doc.text(`Lokasi: ${registration.event.location}`, 60, 210);
                doc.text(`Jenis Tiket: ${registration.ticketTier?.name || 'Reguler'}`, 60, 230);
                doc.text(`Jumlah: ${registration.quantity} Tiket`, 60, 250);
                doc.text(`Nama Pemegang: ${registration.user.name}`, 60, 270);
                doc.text(`Email: ${registration.user.email}`, 60, 290);
                doc.text(`Kode Tiket: ${registration.ticketCode}`, 60, 310);
                doc.image(qrBuffer, 380, 190, { width: 140, height: 140 });
                doc
                    .fillColor('#10B981')
                    .fontSize(12)
                    .text('STATUS: VERIFIED / LUNAS', 60, 340);
                doc.moveTo(60, 375).lineTo(535, 375).stroke('#E5E7EB');
                doc
                    .fontSize(10)
                    .fillColor('#9CA3AF')
                    .text('Tunjukkan QR Code ini kepada petugas di lokasi event untuk verifikasi.', 60, 390, { align: 'center', width: 475 });
                doc.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(2, (0, typeorm_1.InjectRepository)(ticket_tier_entity_1.TicketTier)),
    __param(3, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethod)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map