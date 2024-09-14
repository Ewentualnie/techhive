import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/entities/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.createUser(createUserDto);
  }
}
