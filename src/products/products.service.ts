import {
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { PrismaService } from 'prisma/prisma.service';
import { firebaseApp } from 'src/firebase/firebase.config';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  FindProductQueryDto,
  UpdateProductDto,
} from './dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

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
    });
  }
  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
    console.log(
      '🚀 ~ file: products.service.ts:49 ~ ProductsService ~ getProductById ~ product:',
      product,
    );

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
    console.log(
      '🚀 ~ file: products.service.ts:65 ~ ProductsService ~ getAllPublishedProducts ~ conditions:',
      conditions,
    );
    const products = await this.prismaService.product.findMany({
      take: limit,
      skip: offset,
      where: conditions,
    });
    console.log(
      '🚀 ~ file: products.service.ts:75 ~ ProductsService ~ getAllPublishedProducts ~ products:',
      products,
    );
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
  async createData(data: Buffer): Promise<void> {
    const storage = getStorage(
      firebaseApp,
      'gs://ravn-challenge-v2-daniel.appspot.com',
    );
    const storageRef = ref(
      storage,
      'gs://ravn-challenge-v2-daniel.appspot.com',
    );
    storageRef.bucket = 'ravn-challenge-v2-daniel.appspot.com';

    // upload the file
    await uploadBytes(storageRef, data);
  }
}
