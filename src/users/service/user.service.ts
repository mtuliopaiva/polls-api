import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../domain/dtos/update-user.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async list(params?: { search?: string }) {
    const [data, total] = await Promise.all([
      this.userRepository.findMany(params?.search),
      this.userRepository.count(params?.search),
    ]);

    return { data, total };
  }

  async findByUuid(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(uuid: string, dto: UpdateUserDto) {
    await this.findByUuid(uuid);

    const data: {
      email?: string;
      type?: UserType;
      password?: string;
    } = {
      ...(dto.email ? { email: dto.email } : {}),
      ...(dto.type ? { type: dto.type } : {}),
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
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

    if (!user) {
      throw new NotFoundException('Deleted user not found');
    }

    return this.userRepository.update(uuid, {
      deletedAt: null,
    });
  }
}
