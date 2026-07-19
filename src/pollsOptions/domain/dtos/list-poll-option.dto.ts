import { ApiProperty } from '@nestjs/swagger';
import { ReadPollOptionDto } from './read-poll-option.dto';

class ListPollOptionMetaDto {
  @ApiProperty()
  total: number;
}

export class ListPollOptionDto {
  @ApiProperty({
    type: [ReadPollOptionDto],
  })
  data: ReadPollOptionDto[];

  @ApiProperty({
    type: ListPollOptionMetaDto,
  })
  meta: ListPollOptionMetaDto;
}
