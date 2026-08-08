import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  private checkOrganizerVerification(user: User) {
    if (user.role === UserRole.ORGANIZER && !user.isVerified) {
      throw new ForbiddenException(
        'Akun organizer Anda belum diverifikasi oleh admin (isVerified: false). Anda tidak dapat melakukan tindakan ini.',
      );
    }
  }

  async create(
    createDto: CreatePaymentMethodDto,
    user: User,
  ): Promise<PaymentMethod> {
    this.checkOrganizerVerification(user);
    const paymentMethod = this.paymentMethodRepository.create({
      ...createDto,
      organizerId: user.id,
    });
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async findAllForOrganizer(organizerId: string): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { organizerId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllMyMethods(user: User): Promise<PaymentMethod[]> {
    this.checkOrganizerVerification(user);
    return this.paymentMethodRepository.find({
      where: { organizerId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaymentMethod> {
    const method = await this.paymentMethodRepository.findOne({
      where: { id },
    });
    if (!method) {
      throw new NotFoundException('Metode pembayaran tidak ditemukan');
    }
    return method;
  }

  async update(
    id: string,
    updateDto: UpdatePaymentMethodDto,
    user: User,
  ): Promise<PaymentMethod> {
    this.checkOrganizerVerification(user);
    const method = await this.findOne(id);
    if (method.organizerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk mengubah metode pembayaran ini',
      );
    }
    Object.assign(method, updateDto);
    return this.paymentMethodRepository.save(method);
  }

  async remove(id: string, user: User): Promise<void> {
    this.checkOrganizerVerification(user);
    const method = await this.findOne(id);
    if (method.organizerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk menghapus metode pembayaran ini',
      );
    }
    await this.paymentMethodRepository.remove(method);
  }
}
