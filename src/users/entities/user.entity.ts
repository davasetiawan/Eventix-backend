import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from '../../events/entities/event.entity';
import { Registration } from '../../registrations/entities/registration.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  USER = 'USER',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Budi Santoso' })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({ example: 'budi@eventix.com' })
  @Column({ type: 'varchar', unique: true, length: 150 })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @ApiPropertyOptional({ example: 'Eventix Org' })
  @Column({ type: 'varchar', nullable: true })
  organizationName: string;

  @ApiPropertyOptional({ example: 'Penyelenggara Konser Musik dan Seminar' })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @OneToMany(() => Registration, (reg) => reg.user)
  registrations: Registration[];
}
