import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

import { PartialType } from '@nestjs/swagger';

export class FindProductQueryDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  category?: string;
}
