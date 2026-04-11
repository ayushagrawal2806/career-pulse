import type { AuthResponse } from "../models/Auth";
import { login, signup } from "../api/collections/auth";
import { useMutation } from "@tanstack/react-query";

import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";
import type { ErrorModel } from "../models/Error";

export const useLogin = (
  onSuccess: (data: AuthResponse) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: login,
    onSuccess: onSuccess,
    onError: OnError,
  });
};

export const useLogout = () => {
  const logout = useAppStore((s) => s.logout);
  const navigate = useNavigate();
  return () => {
    logout();
    navigate("/login");
  };
};

export const useSignup = (
  onSuccess: (data: AuthResponse) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: signup,
    onSuccess: onSuccess,
    onError: OnError,
  });
};
