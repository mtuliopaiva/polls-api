import { ApiProperty } from '@nestjs/swagger';
import { ReadEventLogsDto } from './read-eventLogs.dto';

export class ListEventLogsDto {
  @ApiProperty({ type: [ReadEventLogsDto] })
  data: ReadEventLogsDto[];

  @ApiProperty()
  total: number;
}
