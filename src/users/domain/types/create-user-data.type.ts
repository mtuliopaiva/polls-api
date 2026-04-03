import { UserType } from '@prisma/client';

export type CreateUserData = {
  email: string;
  password: string;
  type: UserType;
};
