import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsResponseDto {
  @ApiProperty({ example: 120 })
  totalUsers: number;

  @ApiProperty({ example: 15 })
  totalOrganizers: number;

  @ApiProperty({ example: 35 })
  totalEvents: number;

  @ApiProperty({ example: 250 })
  totalTicketsSold: number;

  @ApiProperty({ example: 12500000 })
  totalRevenue: number;
}
