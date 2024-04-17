import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/modules/auth/abstract/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) { }

  async create(data: CreateUserDto) {
    const user: User = this.userRepository.create({
      ...data,
      password: await this.hashingService.hash(data.password),
    });

    return await this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find()
  }

  findById(id: number | string) {
    return this.userRepository.findOneBy({ id: +id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
