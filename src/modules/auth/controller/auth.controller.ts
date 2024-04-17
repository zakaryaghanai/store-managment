import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthenticationService } from '../service/authentication.service';


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthenticationService
  ) { }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const { email, password, rememberMe } = signInDto
    return this.authService.signIn(email, password, rememberMe);
  }


}
