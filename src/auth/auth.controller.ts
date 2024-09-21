import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/entities/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'New user registration' })
  @ApiResponse({
    status: 201,
    description: 'User information ',
    content: {
      'application/json': {
        example: {
          user: {
            email: 'user@example.com',
            id: 3,
          },
          // tokens: {
          //   accessToken: 'accessToken',
          //   refreshToken: 'refreshToken',
          // },
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.createUser(createUserDto);
  }
}
