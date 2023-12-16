import { IsInt, IsUUID, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({
    example: 1,
    description: 'The quantity of the product in the cart',
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426655440000',
    description: 'The ID of the product in the cart',
  })
  @IsUUID()
  productId: string;
}
