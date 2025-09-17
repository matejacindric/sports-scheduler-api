import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/resources/users/users.module';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from './jwt.strategy';
import { AppConfigService } from '../config/app-config.service';
import { AppConfigModule } from '../config/app-config.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.auth.jwtSecret,
        signOptions: { expiresIn: appConfigService.auth.jwtExpiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
