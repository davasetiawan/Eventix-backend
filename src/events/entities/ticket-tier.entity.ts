import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity('ticket_tiers')
export class TicketTier {
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'VIP Ticket' })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({ example: 150000 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ example: 50 })
  @Column({ type: 'int', default: 100 })
  quota: number;

  @ApiProperty({ example: 5 })
  @Column({ type: 'int', default: 0 })
  soldQuota: number;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' })
  @Column({ type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.ticketTiers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
