import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';

import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
