import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthenticationService } from './service/authentication.service';
import { UserModule } from '../user/user.module';
import { RefreshToken } from './entity/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HashingService } from './abstract/hashing.service';
import { BcryptService } from './service/bcrypt.service';
import { RefreshTokenService } from './service/refresh-token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [
    AuthenticationService,
    RefreshTokenService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthController]
})
export class AuthModule {}
