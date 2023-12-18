import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return next.handle();
    }

    const tokenOnBlacklist = await this.prisma.tokenBlacklist.findUnique({
      where: {
        token,
      },
    });
    if (tokenOnBlacklist) {
      throw new UnauthorizedException('Invalid token');
    }

    return next.handle();
  }
}
