import { IsOptional } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class FindProductQueryDto extends PartialType(PaginationQueryDto) {
  @ApiProperty({
    example: 'dogs',
    description: 'The category of the product',
  })
  @IsOptional()
  category?: string;
}
