import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsOptional } from 'class-validator';

export class ReadEventLogsDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  context?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  stack?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: JsonValue | null;

  @ApiProperty()
  createdAt: Date;
}
