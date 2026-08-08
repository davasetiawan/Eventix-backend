import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
    seedAdminUser(): Promise<void>;
}
