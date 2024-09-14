import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/entities/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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
    console.log(user);

    if (user) {
      throw new BadRequestException(
        `user with email ${createUserDto.email} is already exists`,
      );
    } else {
      user = this.userRepository.create({
        email: createUserDto.email,
        password: createUserDto.pass,
      });
      user = await this.userRepository.save(user);
    }

    return user;
  }
}
