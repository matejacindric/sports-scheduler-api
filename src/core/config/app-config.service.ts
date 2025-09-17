import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';

@Injectable()
export class AppConfigService {
  constructor(public readonly auth: AuthConfig) {}
}
