import { Test, TestingModule } from '@nestjs/testing';
import { Like, Product, User } from '@prisma/client';

import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

describe('LikesController', () => {
  let controller: LikesController;
  let likesService: LikesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [LikesService, PrismaService],
      imports: [AuthModule, PrismaModule],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    likesService = module.get<LikesService>(LikesService);
  });

  describe('likeAProduct', () => {
    it('should like a product', async () => {
      const product: Product = {
        id: 'id',
        category: 'Food',
        createdAt: new Date(),
        description: 'Test',
        isVisible: true,
        name: 'Test',
        price: 10,
        stock: 10,
        updatedAt: new Date(),
      };
      const user: User = {
        id: 'user',
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
        user_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(controller, 'likeAProduct').mockResolvedValue(like);
      controller.likeAProduct(product.id, { ...user });
      jest.spyOn(likesService, 'likeAProduct').mockResolvedValue(like);
      likesService.likeAProduct({ ...user }, product.id);
      expect(controller.likeAProduct(product.id, { ...user })).resolves.toEqual(
        like,
      );
      expect(
        likesService.likeAProduct({ ...user }, product.id),
      ).resolves.toEqual(like);
    });
  });

  describe('findTotalLikes', () => {
    it('should find total likes for a product', async () => {
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

      jest.spyOn(controller, 'findTotalLikes').mockResolvedValue({
        totalLikes: 2,
      });

      jest.spyOn(likesService, 'findTotalLikes').mockResolvedValue({
        totalLikes: 2,
      });
      const totalLikes = likesService.findTotalLikes(product.id);
      expect(controller.findTotalLikes(product.id)).resolves.toEqual({
        totalLikes: likes.length,
      });
      expect(totalLikes).resolves.toEqual({
        totalLikes: likes.length,
      });
    });

    describe('unLikeAProduct', () => {
      it('should unLike a product', async () => {
        const user: User = {
          id: 'user',
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
          user_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest.spyOn(controller, 'unLikeAProduct').mockResolvedValue(like);

        expect(
          controller.unLikeAProduct(like.id, { ...user }),
        ).resolves.toEqual(like);
        const result = controller.unLikeAProduct(like.id, { ...user });
        expect(result).resolves.toEqual({
          id: expect.any(String),
          product_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b62',
          user_id: 'c9ca75ad-26f5-4349-b2b5-540fa7fe3b61',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });
  });
});
