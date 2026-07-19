import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePollOptionDto {
  @ApiPropertyOptional({
    example: 'Option A updated',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  label?: string;
}
