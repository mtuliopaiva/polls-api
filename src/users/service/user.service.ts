import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../domain/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async list(params?: { search?: string; includeDeleted?: boolean }) {
    const where = {
      ...(params?.includeDeleted ? {} : { deletedAt: null }),
      ...(params?.search
        ? { email: { contains: params.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.userRepository.findMany(where),
      this.userRepository.count(where),
    ]);

    return { data, total };
  }

  async findByUuid(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(uuid: string, dto: UpdateUserDto) {
    await this.findByUuid(uuid);

    const data: any = {
      ...(dto.email && { email: dto.email }),
      ...(dto.type && { type: dto.type }),
    };

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepository.update(uuid, data);
  }

  async softDelete(uuid: string) {
    await this.findByUuid(uuid);

    return this.userRepository.update(uuid, {
      deletedAt: new Date(),
    });
  }

  async restore(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);

    if (!user) throw new NotFoundException('User not found');
    if (!user.deletedAt) throw new BadRequestException('User is not deleted');

    return this.userRepository.update(uuid, {
      deletedAt: null,
    });
  }
}
