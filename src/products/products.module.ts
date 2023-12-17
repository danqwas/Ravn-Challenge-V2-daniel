import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FirebaseService } from '../firebase/firebase.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, FirebaseService],
  exports: [ProductsService],
})
export class ProductsModule {}
