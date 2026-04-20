import type { UserRole } from "../enums/UserRoles";
import type { User } from "./User";
export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  role: (typeof UserRole)[keyof typeof UserRole];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
