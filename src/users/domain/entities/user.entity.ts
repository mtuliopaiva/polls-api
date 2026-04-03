import { UserType } from '@prisma/client';

export class UserEntity {
  uuid: string;
  email: string;
  password: string;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
