import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, LogoutUserDto } from './dto';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

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

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAnUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Test123456',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['CLIENT'],
      };

      const user = await service.createAnUser(createUserDto);

      // delete the user created
      await prismaService.user.delete({
        where: {
          id: user.id,
        },
      });
      expect(user.email).toEqual(createUserDto.email);
      // Add more assertions based on your data model
    });
  });

  describe('loginAnUser', () => {
    it('should login an existing user and return a token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Test123456',
      };

      const user = {
        id: uuidv4(),
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: await argon2.hash('Test123456'),
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.loginAnUser(loginUserDto);

      expect(result.access_token).toBeDefined();
      // Add more assertions based on your data model
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'Test123456',
      };

      jest
        .spyOn(service['prisma'].user, 'findUnique') // Replace with your actual Prisma service property
        .mockResolvedValue(null);

      await expect(service.loginAnUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is not valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'InvalidPassword',
      };

      const user = {
        id: uuidv4(),
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
        password: await argon2.hash('Test123456'),
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest
        .spyOn(service['prisma'].user, 'findUnique') // Replace with your actual Prisma service property
        .mockResolvedValue(user);

      await expect(service.loginAnUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logoutAnUser', () => {
    const logoutUserDto: LogoutUserDto = {
      refreshToken: 'token',
    };

    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'Test123456',
    };
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Test123456',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['CLIENT'],
    };

    it('should successfully log out an existing user', async () => {
      await service.createAnUser(createUserDto);
      const user = await service.loginAnUser(loginUserDto);
      const result = await service.logoutAnUser(logoutUserDto, user);
      await prismaService.user.delete({
        where: {
          id: user.id,
        },
      });

      expect(result.success).toBeTruthy();
      expect(result.message).toEqual('User logged out');
    });
  });

  describe('getJsonWebToken', () => {
    it('should return a valid JSON web token', () => {
      const payload = {
        id: uuidv4(),
        email: 'test@example.com',
        roles: [UserRole.CLIENT],
      };
      const token = service.getJsonWebToken(payload);

      const decoded = jwtService.verify(token);

      expect(decoded).toMatchObject(payload);
    });
  });
});
