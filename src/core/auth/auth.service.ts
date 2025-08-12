import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/resources/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserRole } from 'src/common/enums/user-role';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);
    if (user)
      throw new ConflictException('A user with this email already exists');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      role: UserRole.USER,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
