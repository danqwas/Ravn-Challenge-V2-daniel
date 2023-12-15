import { Auth } from 'src/auth/decorators/auth.decorator';

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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import {
  CreateProductDto,
  FindProductQueryDto,
  UpdateProductDto,
} from './dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiBearerAuth()
  @Auth(UserRole.MANAGER)
  deleteAProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id);
  }
  // @Post()
  // @ApiOperation({ summary: 'Upload an image' })
  // @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  // @UseInterceptors(FileInterceptor('image'))
  // @ApiConsumes('multipart/form-data')
  // async uploadImage(@UploadedFile() image: Multer.File): Promise<void> {
  //   const buffer = image.buffer; // Get the buffer containing the file data
  //   await this.productsService.createData(buffer);
  // }
}
