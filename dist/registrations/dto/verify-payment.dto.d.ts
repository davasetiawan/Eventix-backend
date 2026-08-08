export declare enum PaymentVerifyAction {
    APPROVE = "APPROVE",
    REJECT = "REJECT"
}
export declare class VerifyPaymentDto {
    action: PaymentVerifyAction;
    rejectionReason?: string;
}
