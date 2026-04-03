import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';

export class ReadAuditDto {
  @ApiProperty()
  uuid: string;

  @ApiPropertyOptional({ nullable: true })
  actorUuid: string | null;

  @ApiPropertyOptional({ nullable: true })
  actorEmail: string | null;

  @ApiProperty()
  action: string;

  @ApiProperty()
  entity: string;

  @ApiPropertyOptional({ nullable: true })
  entityUuid: string | null;

  @ApiPropertyOptional({ nullable: true })
  oldData: JsonValue | null;

  @ApiPropertyOptional({ nullable: true })
  newData: JsonValue | null;

  @ApiPropertyOptional({ nullable: true })
  metadata: JsonValue | null;

  @ApiProperty()
  createdAt: Date;
}
