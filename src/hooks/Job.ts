import { useMutation, useQuery } from "@tanstack/react-query";
import { getJobApplications, getMyJobs, postJob } from "../api/collections/Job";
import type { JobResponseDto } from "../models/Job";
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
