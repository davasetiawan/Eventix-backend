import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { TicketTier } from '../events/entities/ticket-tier.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { User } from '../users/entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class RegistrationsService {
    private readonly registrationRepository;
    private readonly eventRepository;
    private readonly ticketTierRepository;
    private readonly paymentMethodRepository;
    private readonly cloudinaryService;
    constructor(registrationRepository: Repository<Registration>, eventRepository: Repository<Event>, ticketTierRepository: Repository<TicketTier>, paymentMethodRepository: Repository<PaymentMethod>, cloudinaryService: CloudinaryService);
    private checkOrganizerVerification;
    private generateTicketCode;
    register(createDto: CreateRegistrationDto, user: User, paymentProof?: Express.Multer.File): Promise<Registration>;
    uploadPaymentProof(id: string, dto: UploadPaymentProofDto, user: User): Promise<Registration>;
    findOrganizerPayments(user: User): Promise<Registration[]>;
    verifyPayment(id: string, dto: VerifyPaymentDto, user: User): Promise<Registration>;
    findMyTickets(user: User): Promise<Registration[]>;
    findOne(id: string): Promise<Registration>;
    generateTicketPdf(id: string, user: User): Promise<Buffer>;
}
