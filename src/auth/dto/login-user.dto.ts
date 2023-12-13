import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: '9zTqH@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Abc123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,50}$/, {
    message:
      'The password must have an Uppercase, lowercase letter, and a number',
  })
  password: string;
}
