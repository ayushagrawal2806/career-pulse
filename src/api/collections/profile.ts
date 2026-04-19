import type { ApiResponse } from "../../models/ApiResponse";
import type { UpdateProfileRequest, User } from "../../models/User";
import { API } from "../api";

export const myProfile = (
  data: UpdateProfileRequest,
): Promise<ApiResponse<User>> => {
  return API.put("/profile", data);
};
