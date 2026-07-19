import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty()
  @IsUUID()
  optionUuid: string;
}
