import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class ReadUserDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserType })
  type: UserType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
