import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { User } from './users/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { TicketTier } from './events/entities/ticket-tier.entity';
import { Registration } from './registrations/entities/registration.entity';
import { PaymentMethod } from './payment-methods/entities/payment-method.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const entities = [User, Event, TicketTier, Registration, PaymentMethod];
        const logging = config.get<string>('NODE_ENV') === 'development';
        const netlifyDbUrl = config.get<string>('NETLIFY_DB_URL');

        // Di Netlify: pakai Netlify Database. Skema dikelola lewat
        // netlify/database/migrations, jadi synchronize dimatikan.
        if (netlifyDbUrl) {
          return {
            type: 'postgres' as const,
            url: netlifyDbUrl,
            entities,
            synchronize: false,
            uuidExtension: 'pgcrypto' as const,
            extra: { max: 1 },
            logging,
          };
        }

        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_DATABASE', 'eventix_db'),
          entities,
          synchronize: config.get<boolean>('DB_SYNC', true),
          logging,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    EventsModule,
    RegistrationsModule,
    PaymentMethodsModule,
    DashboardModule,
    CloudinaryModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
