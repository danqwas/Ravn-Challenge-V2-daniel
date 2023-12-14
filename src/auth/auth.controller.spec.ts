import { v4 as uuidv4 } from 'uuid';

import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, LogoutUserDto } from './dto';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, PrismaService],
      imports: [
        ConfigModule,
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
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user for the petStore', async () => {
      const user: User = {
        id: uuidv4(),
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['CLIENT'],
      };
      const result = {
        id: user.id,
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: true,
      };
      jest
        .spyOn(authService, 'createAnUser')
        .mockImplementation(() => Promise.resolve(result));

      expect(await authController.create(createUserDto)).toEqual({
        id: user.id,
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: true,
      });
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Test123456',
      };

      const user: User = {
        id: uuidv4(),
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      const result = {
        ...user,
        access_token: 'token',
      };

      jest
        .spyOn(authService, 'loginAnUser')
        .mockImplementation(() => Promise.resolve(result));

      expect(await authController.login(loginUserDto)).toEqual({
        ...user,
        access_token: 'token',
      });
    });
    it('should throw an error if credentials are not valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Test123456',
      };

      jest
        .spyOn(authService, 'loginAnUser')
        .mockImplementation(() => Promise.reject(new UnauthorizedException()));

      await expect(authController.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should log out an existing user', async () => {
      const logoutUserDto: LogoutUserDto = {
        refreshToken: 'token',
      };

      const user: User = {
        id: uuidv4(),
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(authService, 'logoutAnUser').mockImplementation(() =>
        Promise.resolve({
          success: true,
          message: 'User logged out',
        }),
      );

      expect(await authController.logout(logoutUserDto, user)).toEqual({
        success: true,
        message: 'User logged out',
      });
    });
  });
});
