import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { User } from 'src/models/user.entity';
import { UtilsService } from 'src/utils/util.service';
import UserRes from 'src/types/res';
import { LoginUserDto } from 'src/models/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private utilService: UtilsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserRes> {
    if (createUserDto.pass != createUserDto.pass2) {
      throw new BadRequestException('passwords must match');
    }

    try {
      const user = this.userRepository.create(createUserDto);

      user.hashPass = await this.utilService.hashData(createUserDto.pass);

      await this.userRepository.save(user);

      const tokens = await this.utilService.getTokens(
        user.id,
        user.email,
        user.role,
      );

      await this.utilService.updateRtHash(user.id, tokens.refreshToken);
      return { user, tokens };
    } catch (error) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<UserRes> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new NotFoundException(
        `User with email ${loginUserDto.email} not found`,
      );
    }

    const resultCompare = await this.utilService.compareHash(
      loginUserDto.password,
      user.hashPass,
    );

    if (!resultCompare) {
      throw new ForbiddenException('Access denied');
    }

    await this.userRepository.save(user);

    const tokens = await this.utilService.getTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.utilService.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logOut(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async refresh(userId: number, rt: string): Promise<UserRes> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (
      !user.refreshToken ||
      !this.utilService.compareHash(rt, user.refreshToken)
    ) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.utilService.getTokens(
      user.id,
      user.email,
      user.role,
    );
    await this.utilService.updateRtHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }
}
