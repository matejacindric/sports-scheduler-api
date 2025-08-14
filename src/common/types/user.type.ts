import { UserRole } from '../enums/user-role';

export type User = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
};
