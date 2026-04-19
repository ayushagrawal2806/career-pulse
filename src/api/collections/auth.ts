import type { ApiResponse } from "../../models/ApiResponse";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "../../models/Auth";
import { API } from "../api";

export const login = (
  data: LoginRequest,
): Promise<ApiResponse<AuthResponse>> => {
  return API.post("/auth/login", data);
};

export const signup = (
  data: SignupRequest,
): Promise<ApiResponse<AuthResponse>> => {
  return API.post("/auth/signup", data);
};
