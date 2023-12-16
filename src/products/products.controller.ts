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
  /**
   * Creates a product.
   *
   * @param {CreateProductDto} CreateProductDto - The product information.
   * @return {product} The created product.
   */
  @ApiOperation({ summary: 'Create a product' })
  @ApiBearerAuth()
  @Post()
  @Auth(UserRole.MANAGER)
  createAProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  /**
   * Retrieves products based on the provided query.
   *
   * @param {FindProductQueryDto} findProductQueryDto - The query parameters for finding products.
   * @return {products} The result of retrieving all products.
   */
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @Auth(UserRole.MANAGER)
  @ApiBearerAuth()
  getProducts(@Query() findProductQueryDto: FindProductQueryDto) {
    return this.productsService.getAllProducts(findProductQueryDto);
  }
  /**
   * Retrieves all available products based on the provided query parameters.
   *
   * @param {FindProductQueryDto} findProductQueryDto - The query parameters used to filter the products.
   * @return {products} The list of available products that match the query parameters.
   */
  @Get('pusblished')
  @ApiOperation({ summary: 'Get all available products' })
  getAllAvailableProducts(@Query() findProductQueryDto: FindProductQueryDto) {
    return this.productsService.getAllPublishedProducts(findProductQueryDto);
  }

  /**
   * Retrieves a product by ID.
   *
   * @param {FindProductQueryDto} findProductQueryDto - The query parameters used to find the product.
   * @param {string} id - The ID of the product.
   * @return {product} The product with the specified ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  /**
   * Retrieves the available product by its ID.
   *
   * @param {string} id - The ID of the product.
   * @return {any} The available product with the specified ID.
   */
  @Get(':id/available')
  @ApiOperation({ summary: 'Get a product by id and check if it is available' })
  getAvailableProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getAvailableProductById(id);
  }

  /**
   * Update a product.
   *
   * @param {string} id - The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto - The updated product data.
   * @return {product} The updated product.
   */
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

  /**
   * Deletes a product.
   *
   * @param {string} id - The ID of the product to delete.
   * @return {any} The result of the delete operation.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiBearerAuth()
  @Auth(UserRole.MANAGER)
  deleteAProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id);
  }

  /**
   * Filters the uploaded file based on its extension.
   *
   * @param {Object} req - the request object
   * @param {Object} file - the uploaded file object
   * @param {function} cb - the callback function
   * @return {undefined} no return value
   */
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

  /**
   * Remove an image from the product.
   *
   * @param {string} productId - The ID of the product.
   * @param {string} imageId - The ID of the image to remove.
   * @return {Promise<void>} A promise that resolves when the image is removed.
   */
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
