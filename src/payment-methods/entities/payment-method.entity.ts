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
import { User } from '../../users/entities/user.entity';

export enum PaymentMethodType {
  BANK = 'BANK',
  EWALLET = 'EWALLET',
}

@Entity('payment_methods')
export class PaymentMethod {
  @ApiProperty({ example: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.BANK })
  @Column({
    type: 'enum',
    enum: PaymentMethodType,
    default: PaymentMethodType.BANK,
  })
  type: PaymentMethodType;

  @ApiProperty({ example: 'Bank BCA' })
  @Column({ type: 'varchar', length: 100 })
  bankName: string;

  @ApiProperty({ example: '1234567890' })
  @Column({ type: 'varchar', length: 100 })
  accountNumber: string;

  @ApiProperty({ example: 'PT Eventix Indonesia' })
  @Column({ type: 'varchar', length: 150 })
  accountHolderName: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: 'd3b07384-d113-4956-a5db-e1c8d76b1076' })
  @Column({ type: 'uuid' })
  organizerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-08-05T09:16:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
