import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User } from '../users/entities/user.entity';
export declare class PaymentMethodsService {
    private readonly paymentMethodRepository;
    constructor(paymentMethodRepository: Repository<PaymentMethod>);
    private checkOrganizerVerification;
    create(createDto: CreatePaymentMethodDto, user: User): Promise<PaymentMethod>;
    findAllForOrganizer(organizerId: string): Promise<PaymentMethod[]>;
    findAllMyMethods(user: User): Promise<PaymentMethod[]>;
    findOne(id: string): Promise<PaymentMethod>;
    update(id: string, updateDto: UpdatePaymentMethodDto, user: User): Promise<PaymentMethod>;
    remove(id: string, user: User): Promise<void>;
}
