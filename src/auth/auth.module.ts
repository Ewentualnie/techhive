import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/models/user.entity';
import { UtilsService } from 'src/utils/util.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: 'at-secret' }),
  ],
  providers: [AuthService, UtilsService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
