import { CartService } from 'src/cart/cart.service';
import { PaginationQueryDto } from 'src/common/dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}
  async createAnOrder(user: User) {
    const cart = await this.cartService.getUserCartItems(user);

    const orderItems = cart.cartItems.map((item) => ({
      quantity: item.quantity,
      price: item.product.price,
      product: {
        connect: {
          id: item.productId,
        },
      },
    }));

    const order = await this.prismaService.order.create({
      data: {
        total: +cart.totalPrice,
        items: {
          create: orderItems,
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async getMyOrders(paginationQueryDto: PaginationQueryDto, user: User) {
    const { limit = 10, offset = 0 } = paginationQueryDto;
    const orders = await this.prismaService.order.findMany({
      take: limit,
      skip: offset,
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (!orders) {
      throw new NotFoundException('You have no orders yet');
    }

    return orders;
  }

  async getAnOrder(id: string) {
    const order = await this.prismaService.order.findFirst({
      where: {
        userId: id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
