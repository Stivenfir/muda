import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
