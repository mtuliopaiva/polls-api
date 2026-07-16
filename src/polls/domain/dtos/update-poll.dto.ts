import { ApiPropertyOptional } from '@nestjs/swagger';
import { PollStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePollDto {
  @ApiPropertyOptional({
    example: 'Qual framework backend você prefere?',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: 'Escolha apenas uma alternativa.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  @ApiPropertyOptional({
    enum: PollStatus,
  })
  @IsOptional()
  @IsEnum(PollStatus)
  status?: PollStatus;

  @ApiPropertyOptional({
    example: '2026-07-15T18:00:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  startsAt?: string | null;

  @ApiPropertyOptional({
    example: '2026-07-20T18:00:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  endsAt?: string | null;
}
