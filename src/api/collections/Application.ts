import type { ApiResponse } from "../../models/ApiResponse";
import type {
  Application,
  ApplicationUpdateRequest,
} from "../../models/Application";
import type { PageResponse } from "../../models/PageResponse";

import { API } from "../api";

export const updateApplicationStatus = (
  applicationId: string,
  data: ApplicationUpdateRequest,
): Promise<ApiResponse<void>> => {
  return API.patch(`/applications/${applicationId}/status`, data);
};

export const getMyAppliedJobs = (
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<Application>>> => {
  return API.get(`/applications/my?page=${page}&size=${size}`);
};

export const withdrawApplication = (
  applicationId: string,
): Promise<ApiResponse<void>> => {
  return API.delete(`/applications/${applicationId}`);
};
