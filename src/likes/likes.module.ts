import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';

import { Module } from '@nestjs/common';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [AuthModule, ProductsModule],
})
export class LikesModule {}
