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
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Abc123456',
    description: 'The password of the user',
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
