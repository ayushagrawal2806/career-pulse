import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../models/ApiResponse";
import type { ErrorModel } from "../models/Error";
import {
  getMyAppliedJobs,
  updateApplicationStatus,
  withdrawApplication,
} from "../api/collections/Application";
import type {
  Application,
  ApplicationUpdateRequest,
} from "../models/Application";
import type { PageResponse } from "../models/PageResponse";

export const useUpdateApplicationStatus = (
  onSuccess?: (data: ApiResponse<void>) => void,
  onError?: (error: ErrorModel) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      payload,
    }: {
      applicationId: string;
      payload: ApplicationUpdateRequest;
    }) => updateApplicationStatus(applicationId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["job-applications"],
      });

      onSuccess?.(data);
    },

    onError,
  });
};

export const useGetMyAppliedJobs = (page = 0, size = 10) => {
  return useQuery<ApiResponse<PageResponse<Application>>, ErrorModel>({
    queryKey: ["applied-jobs", page, size],
    queryFn: () => getMyAppliedJobs(page, size),
  });
};

export const useWithdrawApplication = (
  onSuccess?: (data: ApiResponse<void>) => void,
  onError?: (error: ErrorModel) => void,
) => {
  return useMutation<ApiResponse<void>, ErrorModel, string>({
    mutationFn: (applicationId: string) => withdrawApplication(applicationId),

    onSuccess,
    onError,
  });
};
