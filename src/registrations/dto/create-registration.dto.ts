import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRegistrationDto {
  @ApiProperty({ example: 'uuid-event-id' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiPropertyOptional({ example: 'uuid-ticket-tier-id' })
  @IsUUID()
  @IsOptional()
  ticketTierId?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: 'uuid-payment-method-id' })
  @IsUUID()
  @IsOptional()
  paymentMethodId?: string;

  @ApiPropertyOptional({
    example: '/uploads/proof-123.jpg',
    description: 'URL bukti pembayaran (bisa diunggah langsung saat checkout)',
  })
  @IsString()
  @IsOptional()
  paymentProofUrl?: string;
}
