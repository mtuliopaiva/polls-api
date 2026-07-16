import { ApiPropertyOptional } from '@nestjs/swagger';
import { PollStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListPollFiltersDto {
  @ApiPropertyOptional({
    example: 'framework',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: PollStatus,
  })
  @IsOptional()
  @IsEnum(PollStatus)
  status?: PollStatus;
}
