import { PrismaModule } from 'prisma/prisma.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HidePasswordInterceptor } from './interceptors/hide-password.interceptor';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: HidePasswordInterceptor,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule {}
