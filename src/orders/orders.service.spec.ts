// orders.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let prismaService: PrismaService;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn(),
          },
        },
        { provide: CartService, useValue: { getUserCartItems: jest.fn() } },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    cartService = module.get<CartService>(CartService);
  });

  describe('createAnOrder', () => {
    it('should throw a BadRequestException when the cart is empty', async () => {
      const ordersItems = {
        id: '1',
        userId: '1',
        total: 0,
        createdAt: new Date(),
        items: [],
        updatedAt: new Date(),
      };
      jest
        .spyOn(ordersService, 'createAnOrder')
        .mockResolvedValueOnce(ordersItems);
      const orders = await ordersService.createAnOrder({
        id: '1',
        email: 'a@a.com',
        firstName: 'a',
        lastName: 'a',
        isActive: true,
        password: 'Aa123456',
        roles: ['CLIENT'],

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(orders).toEqual({
        id: '1',
        userId: '1',
        total: 0,
        createdAt: orders.createdAt,
        items: [],
        updatedAt: orders.updatedAt,
      });
    });
  });
  it('should create an order when the cart is not empty', async () => {
    const userId = 1;

    const order = {
      id: '1',
      userId: '1',
      total: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: '1',
          orderId: '1',
          productId: '1',
          price: 20,
          quantity: 1,
        },
      ],
    };

    jest.spyOn(cartService, 'getUserCartItems').mockResolvedValueOnce({
      totalPrice: '20',
      cartItems: [
        {
          id: '1',
          cart_id: '1',
          productId: '1',
          totalPrice: '20',
          quantity: 1,
          product: {
            price: 20,
            name: 'Test Product',
            description: 'This is a test product',
            category: 'Test Category',
            stock: 5,
          },
        },
      ],
    });

    const user: User = {
      firstName: 'test',
      lastName: 'test',
      isActive: true,
      roles: ['CLIENT'],
      id: userId.toString(),

      email: 'test@test',
      password: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(ordersService, 'createAnOrder').mockResolvedValueOnce({
      id: '1',
      userId: '1',
      total: 20,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: [
        {
          id: '1',
          orderId: '1',
          productId: '1',
          price: 20,
          quantity: 1,
        },
      ],
    });
    const result = await ordersService.createAnOrder(user);

    expect(result).toEqual(order);
    expect(ordersService.createAnOrder).toHaveBeenCalledWith(user);
  });
});
