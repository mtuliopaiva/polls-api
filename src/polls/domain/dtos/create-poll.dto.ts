import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePollDto {
  @ApiProperty({
    example: 'Qual framework backend você prefere?',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Escolha apenas uma alternativa.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    example: '2026-07-15T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({
    example: '2026-07-20T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
