import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import UserRes from 'src/types/res';

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
          tokens: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserRes> {
    return this.authService.createUser(createUserDto);
  }
}
