import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "../../models/Auth";
import { API } from "../api";

export const login = (data: LoginRequest): Promise<AuthResponse> => {
  return API.post("/auth/login", data);
};

export const signup = (data: SignupRequest): Promise<AuthResponse> => {
  return API.post("/auth/signup", data);
};
