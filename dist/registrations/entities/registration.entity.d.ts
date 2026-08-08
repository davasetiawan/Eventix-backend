import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { TicketTier } from '../../events/entities/ticket-tier.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
export declare enum RegistrationStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAYMENT_SUBMITTED = "PAYMENT_SUBMITTED",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class Registration {
    id: string;
    ticketCode: string;
    status: RegistrationStatus;
    quantity: number;
    totalPrice: number;
    paymentProofUrl: string;
    rejectionReason: string;
    verifiedAt: Date;
    userId: string;
    user: User;
    eventId: string;
    event: Event;
    ticketTierId: string;
    ticketTier: TicketTier;
    paymentMethodId: string;
    paymentMethod: PaymentMethod;
    qrCodeUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
