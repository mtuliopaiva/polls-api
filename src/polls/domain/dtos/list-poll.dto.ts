import { ApiProperty } from '@nestjs/swagger';
import { ReadPollDto } from './read-poll.dto';

export class ListPollDto {
  @ApiProperty({
    type: [ReadPollDto],
  })
  data: ReadPollDto[];

  @ApiProperty()
  total: number;
}
