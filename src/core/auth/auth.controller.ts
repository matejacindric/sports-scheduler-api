import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto, description: 'User login data', required: true })
  @ApiOkResponse({
    description: 'User successfully logged in',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
