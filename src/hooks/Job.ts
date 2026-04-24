import { useMutation, useQuery } from "@tanstack/react-query";
import {
  applyJob,
  deleteJob,
  filterJobs,
  getJobApplications,
  getJobById,
  getMyJobs,
  getSavedJob,
  postJob,
  saveJob,
  unsaveJob,
  updateJob,
} from "../api/collections/Job";
import type {
  JobApplyRequestDto,
  JobRequestDto,
  JobResponseDto,
} from "../models/Job";
import type { ApiResponse } from "../models/ApiResponse";
import type { ErrorModel } from "../models/Error";
import type { PageResponse } from "../models/PageResponse";
import type { ApplicantResponseDto } from "../models/Application";

export const usePostJob = (
  onSuccess: (data: ApiResponse<JobResponseDto>) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: postJob,
    onSuccess: onSuccess,
    onError: OnError,
  });
};

export const useGetMyJobs = () => {
  return useQuery<ApiResponse<JobResponseDto[]>, ErrorModel>({
    queryKey: ["my-jobs"],
    queryFn: getMyJobs,
  });
};

export const useGetJobApplications = (jobId: string, page = 0, size = 10) => {
  return useQuery<ApiResponse<PageResponse<ApplicantResponseDto>>, ErrorModel>({
    queryKey: ["job-applications", jobId, page, size],
    queryFn: () => getJobApplications(jobId, page, size),
    enabled: !!jobId,
  });
};

export const useGetJobById = (jobId?: string) => {
  return useQuery<ApiResponse<JobResponseDto>, ErrorModel>({
    queryKey: ["jobById", jobId],
    queryFn: () => getJobById(jobId!),
    enabled: !!jobId,
  });
};

export const useApplyJob = (
  onSuccess?: (data: ApiResponse<void>) => void,
  onError?: (error: ErrorModel) => void,
) => {
  return useMutation<
    ApiResponse<void>,
    ErrorModel,
    {
      jobId: string;
      data: JobApplyRequestDto;
    }
  >({
    mutationFn: ({ jobId, data }) => applyJob(jobId, data),

    onSuccess,

    onError,
  });
};

export const useFilterJobs = (
  search: string,
  location: string,
  type: string,
  page: number,
  size: number = 10,
) => {
  return useQuery<ApiResponse<PageResponse<JobResponseDto>>, ErrorModel>({
    queryKey: ["jobs", search, location, type, page, size],
    queryFn: () => filterJobs(search, location, type, page, size),
  });
};

export const useSaveJob = (
  onSuccess: (data: ApiResponse<void>) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: (jobId: string) => saveJob(jobId),
    onSuccess: onSuccess,
    onError: OnError,
  });
};

export const useUnsaveJob = (
  onSuccess: (data: ApiResponse<void>) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: (jobId: string) => unsaveJob(jobId),
    onSuccess: onSuccess,
    onError: OnError,
  });
};

export const useGetSavedJobs = (
  page: number = 0,
  size: number = 10,
  isEnabled: boolean = false,
) => {
  return useQuery<ApiResponse<PageResponse<JobResponseDto>>, ErrorModel>({
    queryKey: ["saved-jobs", page, size],
    queryFn: () => getSavedJob(page, size),
    staleTime: 1000 * 60 * 5,
    enabled: isEnabled,
  });
};

export const useDeleteJob = (
  onSuccess: (data: ApiResponse<void>) => void,
  OnError: (error: ErrorModel) => void,
) => {
  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: onSuccess,
    onError: OnError,
  });
};

export const useUpdateJob = (
  onSuccess: (data: ApiResponse<JobResponseDto>) => void,
  onError: (error: ErrorModel) => void,
) => {
  return useMutation<
    ApiResponse<JobResponseDto>,
    ErrorModel,
    {
      jobId: string;
      payload: JobRequestDto;
    }
  >({
    mutationFn: ({ jobId, payload }) => updateJob(jobId, payload),

    onSuccess,

    onError,
  });
};
