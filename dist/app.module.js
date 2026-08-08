"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const events_module_1 = require("./events/events.module");
const registrations_module_1 = require("./registrations/registrations.module");
const payment_methods_module_1 = require("./payment-methods/payment-methods.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const user_entity_1 = require("./users/entities/user.entity");
const event_entity_1 = require("./events/entities/event.entity");
const ticket_tier_entity_1 = require("./events/entities/ticket-tier.entity");
const registration_entity_1 = require("./registrations/entities/registration.entity");
const payment_method_entity_1 = require("./payment-methods/entities/payment-method.entity");
const seed_service_1 = require("./seed.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', 'postgres'),
                    database: config.get('DB_DATABASE', 'eventix_db'),
                    entities: [user_entity_1.User, event_entity_1.Event, ticket_tier_entity_1.TicketTier, registration_entity_1.Registration, payment_method_entity_1.PaymentMethod],
                    synchronize: config.get('DB_SYNC', true),
                    logging: config.get('NODE_ENV') === 'development',
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            events_module_1.EventsModule,
            registrations_module_1.RegistrationsModule,
            payment_methods_module_1.PaymentMethodsModule,
            dashboard_module_1.DashboardModule,
            cloudinary_module_1.CloudinaryModule,
        ],
        providers: [seed_service_1.SeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map