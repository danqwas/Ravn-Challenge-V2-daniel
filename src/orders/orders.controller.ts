import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';

import { Auth, GetUser } from '../auth/decorators';
import { PaginationQueryDto } from '../common/dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an order' })
  createAnOrder(@GetUser() user: User) {
    return this.ordersService.createAnOrder(user);
  }

  @Get('my-orders')
  @Auth(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my orders' })
  getMyOrders(
    @Query() paginationQueryDto: PaginationQueryDto,
    @GetUser() user: User,
  ) {
    return this.ordersService.getMyOrders(paginationQueryDto, user);
  }

  @Get(':id')
  @Auth(UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the order details for a specific user' })
  getAnOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getAnOrder(id);
  }
}
