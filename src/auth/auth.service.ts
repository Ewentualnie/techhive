import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  registration(email: string, pass: string, pass2: string) {
    if (pass != pass2) {
      throw new BadRequestException('passwords must match');
    }
    return 'Hello World! backend service TechHive running here';
  }
}
