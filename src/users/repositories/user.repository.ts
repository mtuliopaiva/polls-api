import { UserEntity } from '../domain/entities/user.entity';
import { CreateUserData } from '../domain/types/create-user-data.type';
import { UpdateUserData } from '../domain/types/update-user-data.type';

export abstract class UserRepository {
  abstract findMany(search?: string): Promise<UserEntity[]>;
  abstract count(search?: string): Promise<number>;
  abstract findByUuid(uuid: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findDeletedByUuid(uuid: string): Promise<UserEntity | null>;
  abstract findAuthUserByEmail(email: string): Promise<{
    uuid: string;
    email: string;
    password: string;
    type: string;
    roles: string[];
    permissions: string[];
  } | null>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract update(uuid: string, data: UpdateUserData): Promise<UserEntity>;
  abstract assignRoleToUser(userUuid: string, roleName: string): Promise<void>;
}
