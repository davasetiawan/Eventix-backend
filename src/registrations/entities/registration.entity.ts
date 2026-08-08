import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { TicketTier } from '../../events/entities/ticket-tier.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';

export enum RegistrationStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_SUBMITTED = 'PAYMENT_SUBMITTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('registrations')
export class Registration {
  @ApiProperty({ example: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'TKT-17182903' })
  @Column({ type: 'varchar', unique: true, length: 50 })
  ticketCode: string;

  @ApiProperty({
    enum: RegistrationStatus,
    example: RegistrationStatus.PENDING_PAYMENT,
  })
  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING_PAYMENT,
  })
  status: RegistrationStatus;

  @ApiProperty({ example: 2 })
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty({ example: 100000 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalPrice: number;

  @ApiPropertyOptional({ example: '/uploads/proof-12345.jpg' })
  @Column({ type: 'varchar', nullable: true })
  paymentProofUrl: string;

  @ApiPropertyOptional({ example: 'Bukti transfer buram' })
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ApiPropertyOptional({ example: '2026-08-05T09:16:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @ApiProperty({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f' })
  @Column({ type: 'uuid' })
  eventId: string;

  @ApiProperty({ type: () => Event })
  @ManyToOne(() => Event, (event) => event.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ApiPropertyOptional({ example: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' })
  @Column({ type: 'uuid', nullable: true })
  ticketTierId: string;

  @ApiPropertyOptional({ type: () => TicketTier })
  @ManyToOne(() => TicketTier, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ticketTierId' })
  ticketTier: TicketTier;

  @ApiPropertyOptional({ example: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a' })
  @Column({ type: 'uuid', nullable: true })
  paymentMethodId: string;

  @ApiPropertyOptional({ type: () => PaymentMethod })
  @ManyToOne(() => PaymentMethod, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: '/uploads/qrcode-12345.png' })
  @Column({ type: 'varchar', nullable: true })
  qrCodeUrl: string;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
