import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { genSalt } from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
    public jwtService: JwtService,
  ) {}

  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.usersRepository.update(userId, {
      refreshToken: hashRt,
    });
  }

  async getTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: 'at-secret',
          expiresIn: '24h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role: role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async hashData(data: string) {
    const saltRounds = +process.env.SALT_FOR_BCRYPT;
    const salt = await genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }

  compareHash(password: string, hashDataPass: string) {
    return bcrypt.compare(password, hashDataPass);
  }
}
