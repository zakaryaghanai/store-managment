import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/modules/user/service/user.service';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthenticationService } from '../service/authentication.service';
import { Public } from '../decorator/public.decorator';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthenticationService,
    private readonly userService: UserService
  ) { }

  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    const { email, password, rememberMe } = signInDto
    return this.authService.signIn(email, password, rememberMe);
  }

  @Public()
  @Post('sign-up')
  singUp(@Body() signUpDto: SignUpDto) {
    return this.userService.create(signUpDto);
  }

}
