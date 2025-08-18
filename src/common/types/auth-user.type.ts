export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
