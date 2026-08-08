import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTicketTierDto {
  @ApiProperty({ example: 'VIP Ticket' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(1)
  quota: number;
}
