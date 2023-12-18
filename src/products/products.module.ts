import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { FirebaseService } from '../firebase/firebase.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, FirebaseService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
