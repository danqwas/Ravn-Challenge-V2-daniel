import * as argon2 from 'argon2';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createAnUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async loginAnUser(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      loginUserDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return {
      ...user,
      access_token: this.getJsonWebToken({
        id: user.id,
        email: user.email,
        roles: user.roles,
      }),
    };
  }

  async logoutAnUser(logoutUserDto: LogoutUserDto, user: User) {
    const { refreshToken } = logoutUserDto;

    const existingToken = await this.prisma.tokenBlacklist.findFirst({
      where: {
        token: refreshToken,
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      throw new UnauthorizedException('User not found');
    }

    if (!existingToken) {
      await this.prisma.tokenBlacklist.create({
        data: {
          token: refreshToken,
          user: {
            connect: {
              id: userExists.id,
            },
          },
        },
      });
    }

    return {
      success: true,
      message: 'User logged out',
    };
  }

  getJsonWebToken(payload: JwtPayload) {
    const { id, email, roles } = payload;

    const token = this.jwtService.sign({
      id,
      email,
      roles,
    });

    return token;
  }
}
