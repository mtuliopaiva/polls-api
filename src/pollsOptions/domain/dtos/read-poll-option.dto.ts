import { ApiProperty } from '@nestjs/swagger';

export class ReadPollOptionDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  pollUuid: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
