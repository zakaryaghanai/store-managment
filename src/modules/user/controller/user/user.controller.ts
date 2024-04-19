import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserService } from '../../service/user.service';
import { Role } from 'src/modules/auth/enum/role.enum';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() createCatDto: CreateUserDto) {
    return this.userService.create(createCatDto);
  }

}
