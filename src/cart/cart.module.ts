import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
