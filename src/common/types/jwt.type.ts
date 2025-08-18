import { UserRole } from '../enums/user-role';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type LoginResponse = {
  access_token: string;
};
