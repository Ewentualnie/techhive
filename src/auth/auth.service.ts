import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/models/dto/create-user.dto';

@Injectable()
export class AuthService {
  async registration(createUserDto: CreateUserDto) {
    if (createUserDto.pass != createUserDto.pass2) {
      throw new BadRequestException('passwords must match');
    }
    const user = null; //add bd, find in bd
    if (user) {
      throw new BadRequestException(
        `user with email ${createUserDto.email} is already exists`,
      );
    }
    //implement creating user or add from service
    return user;
  }
}
