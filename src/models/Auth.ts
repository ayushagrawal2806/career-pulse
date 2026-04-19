import type { User } from "./User";

export type UserRole = "SEEKER" | "RECRUITER";
export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
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
