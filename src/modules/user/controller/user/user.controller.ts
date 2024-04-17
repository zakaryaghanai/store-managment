import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserService } from '../../service/user.service';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post('create')
  async create(@Body() createCatDto: CreateUserDto) {
    return this.userService.create(createCatDto);
  }


}
