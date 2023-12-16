import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Awesome Product',
    description: 'The name of the product',
  })
  @IsString()
  @MinLength(3, {
    message: 'The name must have at least 3 characters',
  })
  name: string;

  @ApiProperty({
    example: 'This is an awesome product.',
    description: 'The description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Cats Toys',
    description: 'The category of the product',
  })
  @IsString()
  @MinLength(3, {
    message: 'The category must have at least 3 characters',
  })
  category: string;

  @ApiProperty({ example: 99.99, description: 'The price of the product' })
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'The price must be a number',
    },
  )
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The stock quantity of the product',
  })
  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: 'The stock must be an integer number',
    },
  )
  stock: number;

  @ApiProperty({
    example: true,
    description: 'Whether the product is visible or not',
  })
  @IsOptional()
  isVisible: boolean;
}
