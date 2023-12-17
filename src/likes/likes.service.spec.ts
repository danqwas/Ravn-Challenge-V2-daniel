import { Test } from '@nestjs/testing';
import { Like, Product, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { LikesService } from './likes.service';

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LikesService, PrismaService],
    }).compile();

    service = module.get(LikesService);
  });

  describe('likeAProduct', () => {
    it('should create a like', async () => {
      const user: User = {
        id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
        email: 'kz8J9@example.com',
        roles: ['CLIENT'],
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: 'John',
        lastName: 'Doe',
        password: 'Password123',
        isActive: true,
      };
      const product: Product = {
        id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        category: 'Food',
        createdAt: new Date(),
        description: 'Test',
        isVisible: true,
        name: 'Test',
        price: 10,
        stock: 10,
        updatedAt: new Date(),
      };

      const like: Like = {
        id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        product_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        user_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'likeAProduct')
        .mockReturnValue(Promise.resolve(like));
      const result = await service.likeAProduct(user, product.id);

      expect(result).toEqual({
        id: expect.any(String),
        product_id: product.id,
        user_id: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
  describe('findTotalLikes', () => {
    it('should return total likes', async () => {
      const users: User[] = [
        {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
          email: 'kz8J9@example.com',
          roles: ['CLIENT'],
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: 'John',
          lastName: 'Doe',
          password: 'Password123',
          isActive: true,
        },
        {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          email: 'kz810@example.com',
          roles: ['CLIENT'],
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: 'John',
          lastName: 'Doe',
          password: 'Password123',
          isActive: true,
        },
      ];
      const product: Product = {
        id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        category: 'Food',
        createdAt: new Date(),
        description: 'Test',
        isVisible: true,
        name: 'Test',
        price: 10,
        stock: 10,
        updatedAt: new Date(),
      };
      const likes: Like[] = [
        {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          product_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          user_id: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          product_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          user_id: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(service, 'findTotalLikes')
        .mockReturnValue(Promise.resolve({ totalLikes: 2 }));
      const result = await service.findTotalLikes(product.id);

      expect(result).toEqual({
        totalLikes: likes.length,
      });
    });
  });
  describe('unLikeAProduct', () => {
    it('should unlike a product', async () => {
      const users: User[] = [
        {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
          email: 'kz8J9@example.com',
          roles: ['CLIENT'],
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: 'John',
          lastName: 'Doe',
          password: 'Password123',
          isActive: true,
        },
        {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          email: 'kz810@example.com',
          roles: ['CLIENT'],
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: 'John',
          lastName: 'Doe',
          password: 'Password123',
          isActive: true,
        },
      ];

      const product: Product = {
        id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        category: 'Food',
        createdAt: new Date(),
        description: 'Test',
        isVisible: true,
        name: 'Test',
        price: 10,
        stock: 10,
        updatedAt: new Date(),
      };
      const like: Like = {
        id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        product_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
        user_id: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'remove').mockResolvedValue(Promise.resolve(like));
      const result = await service.remove(like.id, users[0]);

      expect(result).toEqual(like);
      expect(service.remove).toHaveBeenCalledWith(like.id, users[0]);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
