import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HidePasswordInterceptor } from './interceptors/hide-password.interceptor';
import { LikesModule } from './likes/likes.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        PrismaModule,
        AuthModule,
        ProductsModule,
        CartModule,
        OrdersModule,
        LikesModule,
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
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should have auth module', () => {
    expect(app.get(AuthModule)).toBeDefined();
  });
});
