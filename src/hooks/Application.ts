import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../models/ApiResponse";
import type { ErrorModel } from "../models/Error";
import { updateApplicationStatus } from "../api/collections/Application";
import type { ApplicationUpdateRequest } from "../models/Application";

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
