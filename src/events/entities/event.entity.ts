import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Registration } from '../../registrations/entities/registration.entity';

import { TicketTier } from './ticket-tier.entity';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('events')
export class Event {
  @ApiProperty({ example: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Rock in Rio Jakarta 2026' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'rock-in-rio-jakarta-2026' })
  @Column({ type: 'varchar', unique: true, length: 280 })
  slug: string;

  @ApiProperty({ example: 'Festival konser musik rock terbesar tahun ini...' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: '2026-10-15T19:00:00.000Z' })
  @Column({ type: 'timestamp' })
  startDate: Date;

  @ApiProperty({ example: '2026-10-15T23:00:00.000Z' })
  @Column({ type: 'timestamp' })
  endDate: Date;

  @ApiProperty({ example: 'Gelora Bung Karno, Jakarta' })
  @Column({ type: 'varchar', length: 255 })
  location: string;

  @ApiProperty({ example: 50000 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ example: 200 })
  @Column({ type: 'int', default: 100 })
  quota: number;

  @ApiPropertyOptional({ example: '/uploads/file-12345.jpg' })
  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @ApiProperty({ enum: EventStatus, example: EventStatus.PUBLISHED })
  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PUBLISHED,
  })
  status: EventStatus;

  @ApiProperty({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' })
  @Column({ type: 'uuid' })
  organizerId: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @ApiProperty({ type: () => [TicketTier] })
  @OneToMany(() => TicketTier, (tier) => tier.event, { cascade: true })
  ticketTiers: TicketTier[];

  @ApiProperty({ type: () => [Registration] })
  @OneToMany(() => Registration, (reg) => reg.event)
  registrations: Registration[];

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
