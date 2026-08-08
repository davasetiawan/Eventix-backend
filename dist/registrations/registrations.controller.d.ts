import type { Response } from 'express';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { User } from '../users/entities/user.entity';
import { Registration } from './entities/registration.entity';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    register(createRegistrationDto: CreateRegistrationDto, user: User, paymentProof?: Express.Multer.File): Promise<Registration>;
    findMyTickets(user: User): Promise<Registration[]>;
    findOrganizerPayments(user: User): Promise<Registration[]>;
    verifyPayment(id: string, dto: VerifyPaymentDto, user: User): Promise<Registration>;
    findOne(id: string): Promise<Registration>;
    downloadTicketPdf(id: string, user: User, res: Response): Promise<void>;
}
