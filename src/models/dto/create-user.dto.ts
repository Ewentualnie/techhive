import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IsValidEmail } from 'src/validators/email-validator';
import { IsValidPassword } from 'src/validators/pass-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsValidEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPass123',
  })
  @IsNotEmpty()
  @IsString()
  @IsValidPassword()
  pass: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'strongPass123',
  })
  @IsNotEmpty()
  @IsString()
  pass2: string;
}
