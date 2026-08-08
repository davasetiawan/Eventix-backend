import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Budi Santoso' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Eventix Org' })
  @IsString()
  @IsOptional()
  organizationName?: string;

  @ApiPropertyOptional({
    example: 'Penyelenggara Konser Musik dan Seminar Technology',
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
