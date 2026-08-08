import { User } from '../../users/entities/user.entity';
export declare enum PaymentMethodType {
    BANK = "BANK",
    EWALLET = "EWALLET"
}
export declare class PaymentMethod {
    id: string;
    type: PaymentMethodType;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    isActive: boolean;
    organizerId: string;
    organizer: User;
    createdAt: Date;
    updatedAt: Date;
}
