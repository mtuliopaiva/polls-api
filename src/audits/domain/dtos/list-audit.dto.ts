import { ApiProperty } from '@nestjs/swagger';
import { ReadAuditDto } from './read-audit.dto';

export class ListAuditsDto {
  @ApiProperty({ type: [ReadAuditDto] })
  data: ReadAuditDto[];

  @ApiProperty()
  total: number;
}
