import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthConfig } from './auth.config';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [ConfigModule],
  providers: [AppConfigService, AuthConfig],
  exports: [AppConfigService],
})
export class AppConfigModule {}
