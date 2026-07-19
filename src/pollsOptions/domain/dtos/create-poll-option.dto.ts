import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePollOptionDto {
  @ApiProperty({
    example: ['Option A', 'Option B'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => String)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  labels: string[];
}
