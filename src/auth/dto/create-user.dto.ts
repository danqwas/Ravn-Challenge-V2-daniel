import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: '9zTqH@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Daniel',
    description: 'The first name of the user',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Echegaray',
    description: 'The last name of the user',
  })
  @IsString()
  lastName: string;

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

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ['CLIENT'],
    description: 'The roles of the user',
  })
  roles: UserRole[];
}
