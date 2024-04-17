import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/modules/user/entity/user.entity";
import { UserService } from "src/modules/user/service/user.service";
import { HashingService } from "../abstract/hashing.service";
import { RefreshTokenService } from "./refresh-token.service";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  async signIn(email: string, password: string, rememberMe: boolean) {
    const user = await this.userService.findByEmail(email);

    if (
      !user ||
      !(await this.hashingService.compare(password, user.password))
    ) {
      throw new UnauthorizedException("email or password incorrect");
    }

    const { access_token, refresh_token } = await this.generateTokens(user);
    await this.refreshTokenService.create(refresh_token, user.id);

    return {
      access_token,
      refresh_token: rememberMe ? refresh_token : undefined,
    };
  }
  signOut(token: string) {
    return this.refreshTokenService.delete(token);
  }

  async generateTokens(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ sub: user.id }),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(token: string) {
    const refreshToken = await this.refreshTokenService.findByToken(token);

    if (!refreshToken) {
      throw new UnauthorizedException("jwt expired");
    }

    const { sub } = await this.jwtService.verify(refreshToken.token);
    const user = await this.userService.findById(sub);

    const { access_token, refresh_token } = await this.generateTokens(user);
    await this.refreshTokenService.delete(token);
    await this.refreshTokenService.create(refresh_token, user.id);

    return {
      access_token,
      refresh_token,
    };
  }
}
