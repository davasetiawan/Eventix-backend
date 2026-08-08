import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { TicketTier } from '../events/entities/ticket-tier.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, Event, TicketTier, PaymentMethod]),
    CloudinaryModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
