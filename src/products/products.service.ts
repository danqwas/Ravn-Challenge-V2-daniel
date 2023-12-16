import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { FindProductQueryDto, UpdateProductDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prismaService.product.create({
      data: createProductDto,
    });
    return product;
  }

  async getAllProducts(findProductQueryDto: FindProductQueryDto) {
    const { category, limit = 10, offset = 0 } = findProductQueryDto;
    const conditions = category ? { category: category } : {};
    return await this.prismaService.product.findMany({
      take: limit,
      skip: offset,
      where: {
        ...conditions,
      },
      include: {
        images: true,
      },
    });
  }
  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found with this id' + id);
    }
    return product;
  }
  async getAllPublishedProducts(findProductQueryDto: FindProductQueryDto) {
    const { category, limit = 10, offset = 0 } = findProductQueryDto;
    const conditions = category
      ? { category: category, isVisible: true }
      : { isVisible: true };
    const products = await this.prismaService.product.findMany({
      take: limit,
      skip: offset,
      where: conditions,

      include: {
        images: true,
      },
    });
    return products;
  }
  async getAvailableProductById(id: string) {
    const product = await this.getProductById(id);

    if (!product.isVisible) {
      throw new NotFoundException('Product not found with this id' + id);
    }

    if (product.stock <= 0) {
      throw new BadRequestException('Product out of stock');
    }
    return product;
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.getAvailableProductById(id);

    return await this.prismaService.product.update({
      where: {
        id,
      },
      data: { ...updateProductDto },
    });
  }

  async delete(id: string) {
    const product = await this.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found with this id' + id);
    }
    return await this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }
  async addAnImage(file: Express.Multer.File, productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found with this id' + productId);
    }

    const url = await this.firebaseService.upload(file);

    if (!url) {
      // If firebase don't return a url so the error is a server error
      throw new BadRequestException(
        'Something went wrong while uploading the image to firebase',
      );
    }
    const productImage = await this.prismaService.productImage.create({
      data: {
        url,
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });

    return productImage;
  }

  async removeAnImage(productId: string, imageId: string) {
    const productImage = await this.prismaService.productImage.findUnique({
      where: {
        id: imageId,
        product_id: productId,
      },
    });
    if (!productImage) {
      throw new NotFoundException(
        'Product image not found with this id' + imageId,
      );
    }
    // Dividir la URL por '/'
    const urlParts = productImage.url.split('/');

    // El nombre del archivo estará en la última parte de la URL
    const fileName = urlParts[urlParts.length - 1];
    const isDeleted = await this.firebaseService.delete(fileName);

    if (!isDeleted) {
      throw new BadRequestException(
        'Something went wrong while deleting the image from firebase',
      );
    }
    return await this.prismaService.productImage.delete({
      where: {
        id: productImage.id,
      },
    });
  }
}
