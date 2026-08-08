import { ApiProperty } from '@nestjs/swagger';

export class OrganizerStatsResponseDto {
  @ApiProperty({ example: 5 })
  totalEvents: number;

  @ApiProperty({ example: 42 })
  totalTicketsSold: number;

  @ApiProperty({ example: 3500000 })
  totalRevenue: number;
}
