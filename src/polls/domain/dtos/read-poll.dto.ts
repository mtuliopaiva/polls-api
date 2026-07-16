import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PollStatus } from '@prisma/client';

export class ReadPollDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    enum: PollStatus,
  })
  status: PollStatus;

  @ApiPropertyOptional({
    nullable: true,
  })
  startsAt: Date | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  endsAt: Date | null;

  @ApiProperty()
  createdByUuid: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
