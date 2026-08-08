import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User } from '../users/entities/user.entity';
import { PaymentMethod } from './entities/payment-method.entity';
export declare class PaymentMethodsController {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    findAllForOrganizer(organizerId: string): Promise<PaymentMethod[]>;
    findMyMethods(user: User): Promise<PaymentMethod[]>;
    findOne(id: string): Promise<PaymentMethod>;
    create(createDto: CreatePaymentMethodDto, user: User): Promise<PaymentMethod>;
    update(id: string, updateDto: UpdatePaymentMethodDto, user: User): Promise<PaymentMethod>;
    remove(id: string, user: User): Promise<void>;
}
