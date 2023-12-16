import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';

import { Module } from '@nestjs/common';

import { CartsController } from './cart.controller';
import { CartsService } from './cart.service';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
