import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/core/auth/auth.service';
import { UsersService } from '@/resources/users/users.service';
import { UserRole } from '@/common/enums/user-role';
import { AppConfigService } from '@/core/config/app-config.service';
import { AuthConfig } from '@/core/config/auth.config';

describe('register', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let appConfigService: Partial<AppConfigService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockAuthConfig = {
      jwtExpiresIn: 3600000,
      jwtRefreshExpiresIn: 7 * 24 * 60 * 60 * 1000,
      cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as 'strict' | 'lax',
      },
      nodeEnv: 'dev' as 'dev' | 'prod' | 'test',
      jwtSecret: 'fake-secret',
      sameSiteMap: { dev: 'lax', prod: 'strict', test: 'lax' },
      configService: {} as any,
    } as Partial<AuthConfig> as AuthConfig;

    appConfigService = {
      auth: mockAuthConfig,
    };

    authService = new AuthService(
      usersService as UsersService,
      jwtService as JwtService,
      appConfigService as AppConfigService,
    );
  });

  it('should create a new user with hashed password', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (usersService.create as jest.Mock).mockImplementation((user) =>
      Promise.resolve(user),
    );
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
      'hashedPassword',
    );

    const registerDto = {
      email: 'newuser@example.com',
      password: 'password123',
    };

    const result = await authService.register(registerDto);

    expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    expect(usersService.create).toHaveBeenCalledWith({
      email: registerDto.email,
      password: 'hashedPassword',
      role: 'user',
    });
    expect(result).toEqual({
      email: registerDto.email,
      password: 'hashedPassword',
      role: UserRole.USER,
    });
  });

  it('should throw ConflictException if user already exists', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });

    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'Password123',
      }),
    ).rejects.toThrow(ConflictException);
  });
});

describe('login', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let appConfigService: Partial<AppConfigService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
    };

    // jwtService = {
    //   sign: jest.fn().mockReturnValue('fake-jwt-token'),
    // };
    jwtService = {
      sign: jest
        .fn()
        .mockReturnValueOnce('fake-jwt-access-token')
        .mockReturnValueOnce('fake-jwt-refresh-token'),
    };

    const mockAuthConfig = {
      jwtExpiresIn: 3600000,
      jwtRefreshExpiresIn: 7 * 24 * 60 * 60 * 1000,
      cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as 'strict' | 'lax',
      },
      nodeEnv: 'dev' as 'dev' | 'prod' | 'test',
      jwtSecret: 'fake-secret',
      sameSiteMap: { dev: 'lax', prod: 'strict', test: 'lax' },
      configService: {} as any,
    } as Partial<AuthConfig> as AuthConfig;

    appConfigService = {
      auth: mockAuthConfig,
    };

    authService = new AuthService(
      usersService as UsersService,
      jwtService as JwtService,
      appConfigService as AppConfigService,
    );
  });

  it('should return access token for valid credentials', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedpass',
      role: 'user',
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValueOnce(true);

    const result = await authService.login({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result).toEqual({
      accessToken: 'fake-jwt-access-token',
      refreshToken: 'fake-jwt-refresh-token',
    });
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.login({ email: 'wrong@example.com', password: '123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedpass',
      role: 'user',
    });
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      authService.login({ email: 'test@example.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
