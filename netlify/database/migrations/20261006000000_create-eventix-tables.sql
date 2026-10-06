-- Schema matching the TypeORM entities in src/**/entities
CREATE TYPE "users_role_enum" AS ENUM ('ADMIN', 'ORGANIZER', 'USER');
CREATE TYPE "events_status_enum" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "payment_methods_type_enum" AS ENUM ('BANK', 'EWALLET');
CREATE TYPE "registrations_status_enum" AS ENUM ('PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'VERIFIED', 'REJECTED', 'CANCELLED');

CREATE TABLE "users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar(150) NOT NULL,
  "email" varchar(150) NOT NULL,
  "password" varchar NOT NULL,
  "role" "users_role_enum" NOT NULL DEFAULT 'USER',
  "avatarUrl" varchar,
  "phoneNumber" varchar,
  "isVerified" boolean NOT NULL DEFAULT false,
  "organizationName" varchar,
  "bio" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_users_email" UNIQUE ("email")
);

CREATE TABLE "events" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" varchar(255) NOT NULL,
  "slug" varchar(280) NOT NULL,
  "description" text NOT NULL,
  "startDate" timestamp NOT NULL,
  "endDate" timestamp NOT NULL,
  "location" varchar(255) NOT NULL,
  "price" numeric(10,2) NOT NULL DEFAULT 0,
  "quota" integer NOT NULL DEFAULT 100,
  "bannerUrl" varchar,
  "isApproved" boolean NOT NULL DEFAULT false,
  "status" "events_status_enum" NOT NULL DEFAULT 'PUBLISHED',
  "organizerId" uuid NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "PK_events_id" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_events_slug" UNIQUE ("slug"),
  CONSTRAINT "FK_events_organizer" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "ticket_tiers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar(150) NOT NULL,
  "price" numeric(10,2) NOT NULL DEFAULT 0,
  "quota" integer NOT NULL DEFAULT 100,
  "soldQuota" integer NOT NULL DEFAULT 0,
  "eventId" uuid NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "PK_ticket_tiers_id" PRIMARY KEY ("id"),
  CONSTRAINT "FK_ticket_tiers_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE
);

CREATE TABLE "payment_methods" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "type" "payment_methods_type_enum" NOT NULL DEFAULT 'BANK',
  "bankName" varchar(100) NOT NULL,
  "accountNumber" varchar(100) NOT NULL,
  "accountHolderName" varchar(150) NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "organizerId" uuid NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "PK_payment_methods_id" PRIMARY KEY ("id"),
  CONSTRAINT "FK_payment_methods_organizer" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "registrations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "ticketCode" varchar(50) NOT NULL,
  "status" "registrations_status_enum" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "quantity" integer NOT NULL DEFAULT 1,
  "totalPrice" numeric(12,2) NOT NULL DEFAULT 0,
  "paymentProofUrl" varchar,
  "rejectionReason" text,
  "verifiedAt" timestamp,
  "userId" uuid NOT NULL,
  "eventId" uuid NOT NULL,
  "ticketTierId" uuid,
  "paymentMethodId" uuid,
  "qrCodeUrl" varchar,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "PK_registrations_id" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_registrations_ticketCode" UNIQUE ("ticketCode"),
  CONSTRAINT "FK_registrations_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_registrations_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_registrations_ticket_tier" FOREIGN KEY ("ticketTierId") REFERENCES "ticket_tiers"("id") ON DELETE SET NULL,
  CONSTRAINT "FK_registrations_payment_method" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE SET NULL
);
