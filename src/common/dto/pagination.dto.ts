import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

// pagination query dto
export class PaginationQueryDto {
  @ApiProperty({
    example: 1,
    description: 'The limit of items per page',
  })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number;

  @ApiProperty({
    example: 0,
    description: 'The offset of items',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;
}
