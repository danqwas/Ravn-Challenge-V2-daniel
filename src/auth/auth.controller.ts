import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

@ApiTags('Auth Controller')
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
    description: 'Logout user',
  })
  @ApiOperation({
    summary: 'Returns success, JWT should be removed in the client-side',
  })
  @Post('logout')
  async logout() {
    return this.authService.logoutAnUser();
  }
}
