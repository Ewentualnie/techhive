import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { genSalt } from 'bcrypt';
import { CreateUserDto } from 'src/models/dto/create-user.dto';
import { User } from 'src/models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.pass != createUserDto.pass2) {
      throw new BadRequestException('passwords must match');
    }
    let user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new BadRequestException(
        `user with email ${createUserDto.email} is already exists`,
      );
    } else {
      user = this.userRepository.create({
        email: createUserDto.email,
        password: await this.hashData(createUserDto.pass),
      });
      // user = await this.userRepository.save(user);
    }
    return user;
  }

  async hashData(data: string) {
    const saltRounds = +process.env.SALT_FOR_BCRYPT;
    const salt = await genSalt(saltRounds);
    return await bcrypt.hash(data, salt);
  }
}
