import { diskStorage } from 'multer';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { Auth } from '../auth/decorators';
import { CreateProductDto, FindProductQueryDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiBearerAuth()
  @Post()
  @Auth(UserRole.MANAGER)
  createAProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @Auth(UserRole.MANAGER)
  @ApiBearerAuth()
  getProducts(@Query() findProductQueryDto: FindProductQueryDto) {
    return this.productsService.getAllProducts(findProductQueryDto);
  }

  @Get('pusblished')
  @ApiOperation({ summary: 'Get all available products' })
  getAllAvailableProducts(@Query() findProductQueryDto: FindProductQueryDto) {
    return this.productsService.getAllPublishedProducts(findProductQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  @Get(':id/available')
  @ApiOperation({ summary: 'Get a product by id and check if it is available' })
  getAvailableProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getAvailableProductById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiBearerAuth()
  @Auth(UserRole.MANAGER)
  updateAProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiBearerAuth()
  @Auth(UserRole.MANAGER)
  deleteAProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload an image to a product' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!RegExp(/\.(jpg|jpeg|png|gif)$/).exec(file.originalname)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: './static/products',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  @Auth(UserRole.MANAGER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      required: ['file'],
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to be uploaded.',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.productsService.addAnImage(file, id);
  }

  @Delete(':productId/images/:imageId')
  @ApiOperation({ summary: 'Remove an image from a product' })
  @ApiBearerAuth()
  @Auth(UserRole.MANAGER)
  async removeImage(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return await this.productsService.removeAnImage(productId, imageId);
  }
}
