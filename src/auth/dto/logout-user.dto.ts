import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutUserDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
