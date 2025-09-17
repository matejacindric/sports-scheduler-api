import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './auth.dto';
import { Public } from '@/common/decorators/public.decorator';
import { AppConfigService } from '../config/app-config.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto, description: 'User login data', required: true })
  @ApiOkResponse({
    description:
      'User successfully logged in. JWT tokens are set in httpOnly cookies.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    const { cookieOptions, jwtExpiresIn, jwtRefreshExpiresIn } =
      this.appConfigService.auth;

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: jwtExpiresIn,
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: jwtRefreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
