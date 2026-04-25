import type { JobStatus } from "../enums/JobStatus";
import { JobType } from "./../enums/JobType";
export interface JobAboutDto {
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  companyAbout: string;
  skills: string;
}

export interface JobRequestDto {
  title: string;
  companyName: string;
  location: string;
  type: (typeof JobType)[keyof typeof JobType];
  about: JobAboutDto;
  minExperience: number;
  maxExperience: number;
  salaryMin: number;
  salaryMax: number;
}

export interface JobResponseDto {
  id: string;
  recruiterId: string;
  title: string;
  companyName: string;
  location: string;
  type: (typeof JobType)[keyof typeof JobType];
  about: JobAboutDto;
  minExperience: number;
  maxExperience: number;
  salaryMin: number;
  salaryMax: number;
  status: (typeof JobStatus)[keyof typeof JobStatus];
  createdAt: string;
  updatedAt: string;
}

export interface JobApplyRequestDto {
  resumeUrl: string;
  coverLetter?: string;
}

export interface JobStatusUpdateRequest {
  status: (typeof JobStatus)[keyof typeof JobStatus];
}

export type JobStatusType = (typeof JobStatus)[keyof typeof JobStatus];
