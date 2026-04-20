import type { ApplicationStatus } from "../enums/ApplicationStatus";

export interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  appliedAt: string;
}

export interface ApplicationDetail {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  appliedAt: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface ApplicantResponseDto {
  applicantId: string;
  applicationId: string;
  name: string;
  email: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  appliedAt: string;
}

export interface ApplicationUpdateRequest {
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
}

export type ApplicationStatusType =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
