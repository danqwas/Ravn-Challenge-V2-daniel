import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    example: 1,
    description: 'The limit of items per page',
  })
  @IsPositive()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    example: 1,
    description: 'The offset of items',
  })
  @IsPositive()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  offset?: number;
}
