import { ApiProperty } from '@nestjs/swagger';

export class ReadVoteDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  pollUuid: string;

  @ApiProperty()
  optionUuid: string;

  @ApiProperty()
  userUuid: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
