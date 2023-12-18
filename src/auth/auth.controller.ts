import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto, LoginUserDto, LogoutUserDto } from './dto';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiProperty({
    description: 'Create user',
    type: CreateUserDto,
    example: {
      email: '9zTqH@example.com',
      password: 'Abc123456',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['CLIENT'],
    },
  })
  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createAnUser(createAuthDto);
  }

  @ApiProperty({
    description: 'Login user',
    type: LoginUserDto,
    example: {
      email: '9zTqH@example.com',
      password: 'Abc123456',
    },
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginAnUser(loginUserDto);
  }

  @ApiProperty({
    description: 'JWT token to be used for user logout',
    example: 'your_jwt_token_here',
  })
  @ApiOperation({
    summary: 'Logout user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success, JWT should be removed on the client-side',
  })
  @Auth()
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Body() logoutUserDto: LogoutUserDto, @GetUser() user: User) {
    return this.authService.logoutAnUser(logoutUserDto, user);
  }
}
