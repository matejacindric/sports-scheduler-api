import { parseDuration } from '@/common/utils/parse-duration.util';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): 'dev' | 'prod' | 'test' {
    return (this.configService.get<string>('NODE_ENV') || 'dev') as
      | 'dev'
      | 'prod'
      | 'test';
  }

  get jwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret)
      throw new InternalServerErrorException('JWT_SECRET is not set');
    return secret;
  }

  get jwtExpiresIn(): number {
    const duration = this.configService.get<string>('JWT_EXPIRES_IN');
    if (!duration)
      throw new InternalServerErrorException('JWT_EXPIRES_IN is not set');
    return parseDuration(duration);
  }

  get jwtRefreshExpiresIn(): number {
    const duration = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    if (!duration)
      throw new InternalServerErrorException(
        'JWT_REFRESH_EXPIRES_IN is not set',
      );
    return parseDuration(duration);
  }

  sameSiteMap: Record<'prod' | 'dev' | 'test', 'strict' | 'lax'> = {
    prod: 'strict',
    dev: 'lax',
    test: 'lax',
  };

  get cookieOptions() {
    return {
      httpOnly: true,
      secure: this.nodeEnv === 'prod',
      sameSite: this.sameSiteMap[this.nodeEnv],
    };
  }
}
