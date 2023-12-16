import { IsOptional } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export class FindProductQueryDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  category?: string;
}
