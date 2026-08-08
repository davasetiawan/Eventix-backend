import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PaymentVerifyAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class VerifyPaymentDto {
  @ApiProperty({
    enum: PaymentVerifyAction,
    example: PaymentVerifyAction.APPROVE,
  })
  @IsEnum(PaymentVerifyAction)
  @IsNotEmpty()
  action: PaymentVerifyAction;

  @ApiPropertyOptional({
    example: 'Bukti transfer tidak terbaca / nominal tidak sesuai',
  })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
