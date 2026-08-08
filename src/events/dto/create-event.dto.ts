import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../entities/event.entity';
import { CreateTicketTierDto } from './create-ticket-tier.dto';

export class CreateEventDto {
  @ApiProperty({ example: 'Rock in Rio Jakarta 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Festival konser musik rock terbesar tahun ini menghadirkan artis internasional.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-10-15T19:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-10-15T23:00:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Gelora Bung Karno, Jakarta' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quota?: number;

  @ApiPropertyOptional({ example: '/uploads/file-12345.jpg' })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({ enum: EventStatus, default: EventStatus.PUBLISHED })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional({
    type: [CreateTicketTierDto],
    example: [
      { name: 'Reguler', price: 50000, quota: 200 },
      { name: 'VIP', price: 150000, quota: 50 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTierDto)
  @IsOptional()
  ticketTiers?: CreateTicketTierDto[];
}
