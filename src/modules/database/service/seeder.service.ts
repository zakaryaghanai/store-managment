import { Injectable } from '@nestjs/common';
import { Role } from 'src/modules/auth/enum/role.enum';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly userService: UserService,
  ) { }

  async seed() {
    const user = await this.userService.findByEmail('admin@gmail.com');

    if (!user) {
      this.userService.create({
        email: 'admin@gmail.com',
        username: 'admin',
        password: '123456',
        role: Role.Admin
      })
    }
  }
}