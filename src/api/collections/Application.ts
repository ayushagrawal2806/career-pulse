import type { ApiResponse } from "../../models/ApiResponse";
import type { ApplicationUpdateRequest } from "../../models/Application";

import { API } from "../api";

export const updateApplicationStatus = (
  applicationId: string,
  data: ApplicationUpdateRequest,
): Promise<ApiResponse<void>> => {
  return API.patch(`/applications/${applicationId}/status`, data);
};
