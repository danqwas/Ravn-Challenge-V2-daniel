import { PrismaService } from 'prisma/prisma.service';

import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class LikesService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Likes a product for a user.
   *
   * @param {User} user - The user who is liking the product.
   * @param {string} productId - The ID of the product being liked.
   * @return {Promise<Like>} The created like object.
   */
  async likeAProduct(user: User, productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.prismaService.like.create({
      data: {
        user: { connect: { id: user.id } },
        product: { connect: { id: productId } },
      },
    });
  }
  /**
   * Finds the total number of likes for a given product.
   *
   * @param {string} productId - The ID of the product.
   * @return {object} - An object containing the total number of likes for the product.
   */
  async findTotalLikes(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: {
        Like: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      totalLikes: product.Like.length,
    };
  }
  async remove(id: string, user: User) {
    const like = await this.prismaService.like.findUnique({
      where: { id, user_id: user.id },
    });
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    return await this.prismaService.like.delete({ where: { id } });
  }
}
