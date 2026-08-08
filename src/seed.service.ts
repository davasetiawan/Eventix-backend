import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    let admin = await this.userRepository.findOne({
      where: [{ role: UserRole.ADMIN }, { email: adminEmail }],
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isVerified: true,
      },
    });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      admin = this.userRepository.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isVerified: true,
        organizationName: 'Eventix Platform Admin',
      });

      await this.userRepository.save(admin);
      this.logger.log(
        `✅ Akun Super Admin berhasil dibuat secara otomatis: ${adminEmail}`,
      );
    } else {
      let isChanged = false;

      if (admin.email !== adminEmail) {
        admin.email = adminEmail;
        isChanged = true;
      }

      const isPasswordSame = admin.password
        ? await bcrypt.compare(adminPassword, admin.password)
        : false;
      if (!isPasswordSame) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(adminPassword, salt);
        isChanged = true;
      }

      if (isChanged) {
        await this.userRepository.save(admin);
        this.logger.log(
          `✅ Kredensial Admin diperbarui di database: ${adminEmail}`,
        );
      } else {
        this.logger.log(
          `ℹ️ Akun Admin terverifikasi di database (${admin.email})`,
        );
      }
    }
  }
}
