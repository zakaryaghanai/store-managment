import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingService } from '../auth/abstract/hashing.service';
import { BcryptService } from '../auth/service/bcrypt.service';
import { User } from './entity/user.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
