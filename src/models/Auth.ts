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
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
