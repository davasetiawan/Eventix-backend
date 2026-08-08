import { PaymentMethodType } from '../entities/payment-method.entity';
export declare class CreatePaymentMethodDto {
    type: PaymentMethodType;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    isActive?: boolean;
}
