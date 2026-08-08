import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class GoogleLoginDto {
  @ApiProperty({ example: 'google-id-token-or-email' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'Budi Santoso', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'budi@gmail.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
