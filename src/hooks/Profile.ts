import { useMutation } from "@tanstack/react-query";
import type { ErrorModel } from "../models/Error";
import type { User } from "../models/User";
import { myProfile } from "../api/collections/profile";
import type { ApiResponse } from "../models/ApiResponse";

export const useProfile = (
  onSuccess: (data: ApiResponse<User>) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: myProfile,
    onSuccess: onSuccess,
    onError: OnError,
  });
};
