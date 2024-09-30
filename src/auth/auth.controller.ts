import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import UserRes from 'src/types/res';
import { LoginUserDto } from 'src/models/dto/login-user.dto';
import { GetCurrentUserId } from 'src/decorators/get-user-id.decorator';
import { GetCurrentUser } from 'src/decorators/get-user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { RtGuard } from 'src/guards/rt-guard';

@Public()
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
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto): Promise<UserRes> {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Get user by email' })
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
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @Public()
  @Post('logout')
  @UseGuards(RtGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  logOut(@GetCurrentUserId(ParseIntPipe) userId: number) {
    console.log('userId2');
    return this.authService.logOut(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
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
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId(ParseIntPipe) userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<UserRes> {
    console.log(`User with id: "${userId}" try to refresh`);
    return this.authService.refresh(userId, refreshToken);
  }
}
