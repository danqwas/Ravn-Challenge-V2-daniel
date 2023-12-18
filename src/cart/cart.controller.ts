import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';

import { Auth, GetUser } from '../auth/decorators';
import { CartService } from './cart.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';

@Controller({
  path: 'carts/items-in-cart',
  version: '1',
})
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @Post()
  @ApiBearerAuth()
  @Auth(UserRole.CLIENT)
  @ApiOperation({ summary: 'Create an cart item' })
  createAnCartItem(
    @Body() createAnCartItemDto: CreateCartItemDto,
    @GetUser() user: User,
  ) {
    return this.cartsService.create(createAnCartItemDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cart items' })
  @ApiBearerAuth()
  @Auth(UserRole.CLIENT)
  findUserCartItems(@GetUser() user: User) {
    return this.cartsService.getUserCartItems(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an cart item' })
  @ApiBearerAuth()
  @Auth(UserRole.CLIENT)
  findACartItem(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.cartsService.findACartItem(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an cart item' })
  @ApiBearerAuth()
  @Auth(UserRole.CLIENT)
  update(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.cartsService.updateAnCartItem(id, updateCartItemDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an cart item' })
  @ApiBearerAuth()
  @Auth(UserRole.CLIENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.cartsService.removeACartItem(id, user);
  }
}
