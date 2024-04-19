import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { SeederService } from './service/seeder.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    UserModule
  ],
  providers: [SeederService],
})
export class DatabaseModule {
  constructor(private readonly seederService: SeederService) {}

  async seed() {
    await this.seederService.seed();
  }
}
