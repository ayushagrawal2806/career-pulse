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

export const filterJobs = (
  search?: string,
  location?: string,
  type?: string,
  page: number = 0,
  size: number = 10,
) => {
  const params = new URLSearchParams();

  if (search?.trim()) params.append("search", search.trim());
  if (location?.trim()) params.append("location", location.trim());
  if (type?.trim()) params.append("type", type.trim());

  params.append("page", page.toString());
  params.append("size", size.toString());

  return API.get<ApiResponse<PageResponse<JobResponseDto>>>(
    `/job/filter?${params.toString()}`,
  );
};

export const saveJob = (jobId: string): Promise<ApiResponse<void>> => {
  return API.post(`/job/${jobId}/save`);
};

export const unsaveJob = (jobId: string): Promise<ApiResponse<void>> => {
  return API.delete(`/job/${jobId}/save`);
};

export const getSavedJob = (
  page = 0,
  size = 10,
): Promise<ApiResponse<PageResponse<JobResponseDto>>> => {
  return API.get(`/job/saved?page=${page}&size=${size}`);
};

export const deleteJob = (jobId: string): Promise<ApiResponse<void>> => {
  return API.delete(`/job/${jobId}`);
};

export const updateJob = (
  jobId: string,
  data: JobRequestDto,
): Promise<ApiResponse<JobResponseDto>> => {
  return API.put(`/job/${jobId}`, data);
};
