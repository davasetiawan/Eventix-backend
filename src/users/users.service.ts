import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
        isVerified: true,
        organizationName: true,
        bio: true,
        createdAt: true,
      },
    });
  }

  async findAllOrganizers() {
    return this.userRepository.find({
      where: { role: UserRole.ORGANIZER },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
        isVerified: true,
        organizationName: true,
        bio: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
        isVerified: true,
        organizationName: true,
        bio: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User dengan ID "${id}" tidak ditemukan`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async verifyOrganizer(id: string, isVerified: boolean = true) {
    const user = await this.findOne(id);
    user.isVerified = isVerified;
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `User "${user.name}" berhasil dihapus` };
  }
}
