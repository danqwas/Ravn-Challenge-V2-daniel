import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

// pagination query dto
export class PaginationQueryDto {
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  limit: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  offset: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  page: number;
}
