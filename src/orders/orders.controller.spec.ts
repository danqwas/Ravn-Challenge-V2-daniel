import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PaginationQueryDto } from '../common/dto';
import { OrdersController } from './orders.controller';
import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;
  let prismaService: PrismaService;
  let cartService: CartService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: CartService,
          useValue: {
            getUserCartItems: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
      imports: [OrdersModule, ConfigModule],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    cartService = module.get<CartService>(CartService);
    jest.spyOn(cartService, 'getUserCartItems').mockResolvedValueOnce({
      cartItems: [],
      totalPrice: '0',
    });
  });

  describe('createAnOrder', () => {
    it('should create an order for the authenticated user', async () => {
      const mockUser: User = { id: '1', roles: [UserRole.CLIENT] } as User;
      jest
        .spyOn(ordersService, 'createAnOrder')
        .mockResolvedValue(mockOrderData);
      jest.spyOn(cartService, 'getUserCartItems').mockResolvedValueOnce({
        cartItems: [],
        totalPrice: '0',
      });

      const result = await controller.createAnOrder(mockUser);

      expect(result).toEqual(mockOrderData);
    });
  });

  describe('getMyOrders', () => {
    it('should get orders for the authenticated user', async () => {
      const mockUser: User = {
        id: '1',
        roles: [UserRole.CLIENT],
      } as User;
      const mockPaginationQuery: PaginationQueryDto = { limit: 10, offset: 0 };
      jest
        .spyOn(ordersService, 'getMyOrders')
        .mockResolvedValue([mockOrderData]);

      const result = await controller.getMyOrders(
        mockPaginationQuery,
        mockUser,
      );

      expect(result).toEqual([mockOrderData]);
    });
  });

  describe('getAnOrder', () => {
    it('should get the details of a specific order for the authenticated manager', async () => {
      const mockOrderId = '123';

      const mockOrderData = {
        id: '1',
        userId: '1',
        total: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: '1',
            orderId: '1',
            productId: 'product1',
            price: 10,
            quantity: 2,
          },
          {
            id: '2',
            orderId: '1',
            productId: 'product2',
            price: 20,
            quantity: 1,
          },
        ],
      };

      jest.spyOn(ordersService, 'getAnOrder').mockResolvedValue(mockOrderData);

      const result = await controller.getAnOrder(mockOrderId);

      expect(result).toEqual(mockOrderData);
    });
  });
});

const mockOrderData = {
  id: '1',
  userId: '1',
  total: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: '1',
      orderId: '1',
      productId: 'product1',
      price: 10,
      quantity: 2,
    },
    {
      id: '2',
      orderId: '1',
      productId: 'product2',
      price: 20,
      quantity: 1,
    },
  ],
};
