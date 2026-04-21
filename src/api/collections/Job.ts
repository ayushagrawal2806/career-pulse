import type { JobApplyRequestDto, JobResponseDto } from "./../../models/Job";
import type { ApiResponse } from "./../../models/ApiResponse";
import type { JobRequestDto } from "../../models/Job";
import { API } from "../api";
import type { PageResponse } from "../../models/PageResponse";
import type { ApplicantResponseDto } from "../../models/Application";

export const postJob = (
  data: JobRequestDto,
): Promise<ApiResponse<JobResponseDto>> => {
  return API.post("/job", data);
};

export const getMyJobs = (): Promise<ApiResponse<JobResponseDto[]>> => {
  return API.get("/job/my");
};

export const getJobApplications = (
  jobId: string,
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<ApplicantResponseDto>>> => {
  return API.get(`/job/${jobId}/applications?page=${page}&size=${size}`);
};

export const getJobById = (
  jobId: string,
): Promise<ApiResponse<JobResponseDto>> => {
  return API.get(`/job/${jobId}`);
};

export const applyJob = (
  jobId: string,
  payload: JobApplyRequestDto,
): Promise<ApiResponse<void>> => {
  return API.post(`/job/${jobId}/apply`, payload);
};
