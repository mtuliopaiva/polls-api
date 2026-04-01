import { User, UserType } from '@prisma/client';

export abstract class UserRepository {
  abstract findMany(where: any): Promise<any[]>;
  abstract count(where: any): Promise<number>;
  abstract findByUuid(uuid: string): Promise<any | null>;
  abstract update(uuid: string, data: any): Promise<any>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(data: {
    email: string;
    passwordHash: string;
    type: UserType;
  }): Promise<User>;
}
