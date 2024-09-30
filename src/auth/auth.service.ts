import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { User } from 'src/models/user.entity';
import { UtilsService } from 'src/utils/util.service';
import UserRes from 'src/types/res';

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
}
