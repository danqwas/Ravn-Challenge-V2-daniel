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
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Daniel',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Echegaray',
  })
  @IsString()
  lastName: string;

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

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: ['CLIENT'],
  })
  roles: UserRole[];
}
