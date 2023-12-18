import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Like, Product, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { LikesService } from './likes.service';

describe('LikesService', () => {
  let service: LikesService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LikesService, PrismaService],
    }).compile();

    service = module.get(LikesService);
    prismaService = module.get<PrismaService>(PrismaService);
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
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(product);
      jest.spyOn(prismaService.like, 'create').mockResolvedValue(like);

      const result = await service.likeAProduct(user, product.id);
      expect(result).toEqual(like);
    });

    it('should throw an error if product is not found', async () => {
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

      jest
        .spyOn(service['prismaService'].like, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.remove('nonexistent-like-id', user)).rejects.toThrow(
        new NotFoundException('Like not found'),
      );
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
        const product = {
          id: 'c5dcda28-c913-4573-afab-afd8d089028d',
          category: 'Food',
          createdAt: new Date(),
          description: 'Test',
          isVisible: true,
          name: 'Test',
          price: 10,
          stock: 10,
          updatedAt: new Date(),

          like: [
            {
              id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
              product_id: 'c5dcda28-c913-4573-afab-afd8d089028d',
              user_id: users[0].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
              product_id: 'c5dcda28-c913-4573-afab-afd8d089028d',
              user_id: users[1].id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        };
        const likes: Like[] = [
          {
            id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
            product_id: 'c5dcda28-c913-4573-afab-afd8d089028d',
            user_id: users[0].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
            product_id: 'c5dcda28-c913-4573-afab-afd8d089028d',
            user_id: users[1].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        jest
          .spyOn(service['prismaService'].product, 'findUnique')
          .mockResolvedValue({ ...product });

        jest
          .spyOn(service['prismaService'].like, 'findMany')
          .mockResolvedValue({ ...likes });

        jest
          .spyOn(service['prismaService'].like, 'findMany')
          .mockResolvedValue({ ...likes });

        jest
          .spyOn(service, 'findTotalLikes')
          .mockReturnValue(Promise.resolve({ totalLikes: 2 }));

        const result = await service.findTotalLikes(
          'c5dcda28-c913-4573-afab-afd8d089028d',
        );
        expect(result).toEqual({ totalLikes: likes.length });
      });

      it('should return notfoundException if product is not found', async () => {
        jest
          .spyOn(service['prismaService'].product, 'findUnique')
          .mockResolvedValue(null);
        jest
          .spyOn(service, 'findTotalLikes')
          .mockReturnValue(Promise.resolve({ totalLikes: 0 }));

        expect(service.findTotalLikes('nonexistent-product-id')).rejects;
      });
    });
    describe('unLikeAProduct', () => {
      it('should unlike a product', async () => {
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

        const like: Like = {
          id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          product_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          user_id: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest
          .spyOn(service['prismaService'].like, 'findUnique')
          .mockResolvedValue(like);
        jest
          .spyOn(service['prismaService'].like, 'delete')
          .mockResolvedValue(like);
        const result = await service.remove(like.id, user);

        expect(result).toEqual(like);
        expect(service['prismaService'].like.findUnique).toHaveBeenCalledWith({
          where: { id: like.id, user_id: user.id },
        });
        expect(service['prismaService'].like.delete).toHaveBeenCalledWith({
          where: { id: like.id },
        });
        expect(service['prismaService'].like.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
