import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadPaymentProofDto {
  @ApiProperty({ example: '/uploads/proof-123.jpg' })
  @IsString()
  @IsNotEmpty()
  paymentProofUrl: string;
}
