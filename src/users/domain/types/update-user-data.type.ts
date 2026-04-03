import { UserType } from '@prisma/client';

export type UpdateUserData = Partial<{
  email: string;
  password: string;
  type: UserType;
  deletedAt: Date | null;
}>;
