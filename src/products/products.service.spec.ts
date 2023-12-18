import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
          useFactory: () => ({
            secret: process.env.JWT_SECRET,
            signOptions: {
              expiresIn: '2h',
            },
          }),
        }),
      ],
      controllers: [ProductsController],
      providers: [
        ProductsService,
        FirebaseService,
        PrismaService,
        ConfigService,
        AuthService,
      ],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
