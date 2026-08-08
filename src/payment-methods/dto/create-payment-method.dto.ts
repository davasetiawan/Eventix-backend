import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PaymentMethodType } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.BANK })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({ example: 'Bank BCA' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ example: 'PT Eventix Indonesia' })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
