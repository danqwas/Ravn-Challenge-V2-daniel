import { AuthModule } from 'src/auth/auth.module';
import { FirebaseService } from 'src/firebase/firebase.service';

import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, FirebaseService],
})
export class ProductsModule {}
