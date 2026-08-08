import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from './entities/user.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiTags('4. Admin')
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mendapatkan Semua Daftar User (Admin)' })
  @ApiOkResponse({ type: [User], description: 'Daftar semua pengguna' })
  findAll() {
    return this.usersService.findAll();
  }

  @ApiTags('4. Admin')
  @Get('organizers')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mendapatkan Daftar Semua Organizer (Admin)' })
  @ApiOkResponse({ type: [User], description: 'Daftar semua akun Organizer' })
  findAllOrganizers() {
    return this.usersService.findAllOrganizers();
  }

  @ApiTags('2. Pengunjung (User)', '3. Organizer')
  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan Detail User Berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID User' })
  @ApiOkResponse({ type: User, description: 'Detail profil pengguna' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiTags('2. Pengunjung (User)', '3. Organizer')
  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui Profil (Nama, Avatar, Telepon, Bio)' })
  @ApiParam({ name: 'id', description: 'ID User' })
  @ApiOkResponse({ type: User, description: 'Profil berhasil diperbarui' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiTags('4. Admin')
  @Patch(':id/verify-organizer')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Verifikasi Akun Organizer (Admin)' })
  @ApiParam({ name: 'id', description: 'ID Organizer yang ingin diverifikasi' })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean })
  @ApiOkResponse({
    type: User,
    description: 'Status verifikasi organizer berhasil diubah',
  })
  verifyOrganizer(
    @Param('id') id: string,
    @Query('isVerified') isVerified?: boolean,
  ) {
    const status =
      isVerified === undefined ? true : String(isVerified) === 'true';
    return this.usersService.verifyOrganizer(id, status);
  }

  @ApiTags('4. Admin')
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Menghapus User (Admin)' })
  @ApiParam({ name: 'id', description: 'ID User' })
  @ApiOkResponse({ description: 'User berhasil dihapus dari database' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
