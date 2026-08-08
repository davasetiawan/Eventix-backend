import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @ApiTags('2. Pengunjung (User)')
  @Get('organizer/:organizerId')
  @ApiParam({ name: 'organizerId', description: 'ID Organizer' })
  @ApiOperation({
    summary: 'Melihat Rekening/E-Wallet Organizer untuk Transfer — Public',
  })
  @ApiOkResponse({
    type: [PaymentMethod],
    description: 'Daftar metode pembayaran organizer',
  })
  findAllForOrganizer(@Param('organizerId') organizerId: string) {
    return this.paymentMethodsService.findAllForOrganizer(organizerId);
  }

  @ApiTags('3. Organizer')
  @Get('my-methods')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Daftar Rekening/E-Wallet Milik Organizer — Organizer',
  })
  @ApiOkResponse({
    type: [PaymentMethod],
    description: 'Daftar rekening bank/e-wallet milik organizer sendiri',
  })
  findMyMethods(@GetUser() user: User) {
    return this.paymentMethodsService.findAllMyMethods(user);
  }

  @ApiTags('2. Pengunjung (User)')
  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID Metode Pembayaran' })
  @ApiOperation({ summary: 'Detail Metode Pembayaran — Public' })
  @ApiOkResponse({
    type: PaymentMethod,
    description: 'Detail metode pembayaran',
  })
  findOne(@Param('id') id: string) {
    return this.paymentMethodsService.findOne(id);
  }

  @ApiTags('🎪 Organizer')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tambah Rekening Bank / E-Wallet — Organizer' })
  @ApiCreatedResponse({
    type: PaymentMethod,
    description: 'Metode pembayaran baru berhasil didaftarkan',
  })
  create(@Body() createDto: CreatePaymentMethodDto, @GetUser() user: User) {
    return this.paymentMethodsService.create(createDto, user);
  }

  @ApiTags('🎪 Organizer')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ubah / Aktifkan / Nonaktifkan Metode Pembayaran — Organizer',
  })
  @ApiParam({ name: 'id', description: 'ID Metode Pembayaran' })
  @ApiOkResponse({
    type: PaymentMethod,
    description: 'Metode pembayaran berhasil diperbarui',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentMethodDto,
    @GetUser() user: User,
  ) {
    return this.paymentMethodsService.update(id, updateDto, user);
  }

  @ApiTags('🎪 Organizer')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus Metode Pembayaran — Organizer' })
  @ApiParam({
    name: 'id',
    description: 'ID Metode Pembayaran yang ingin dihapus',
  })
  @ApiOkResponse({ description: 'Metode pembayaran berhasil dihapus' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.paymentMethodsService.remove(id, user);
  }
}
