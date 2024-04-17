import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/refresh-token.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  create(token: string, userId: number) {
    const refreshToken: RefreshToken = this.refreshTokenRepository.create({
      token,
      user: { id: userId },
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOneBy({ token });
  }

  delete(token: string) {
    return this.refreshTokenRepository.delete({ token });
  }

}
