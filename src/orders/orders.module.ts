import { AuthModule } from 'src/auth/auth.module';
import { CartModule } from 'src/cart/cart.module';

import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [AuthModule, CartModule],
})
export class OrdersModule {}
