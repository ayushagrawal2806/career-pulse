import type { JobStatus } from "../enums/JobStatus";
import { JobType } from "./../enums/JobType";
export interface JobRequestDto {
  title: string;
  company: string;
  location: string;
  type: (typeof JobType)[keyof typeof JobType];
  description: string;
  minExperience: number;
  maxExperience: number;
  salaryMin: number;
  salaryMax: number;
}

export interface JobResponseDto {
  id: string;
  recruiterId: string;
  title: string;
  company: string;
  location: string;
  type: (typeof JobType)[keyof typeof JobType];
  description: string;
  minExperience: number;
  maxExperience: number;
  salaryMin: number;
  salaryMax: number;
  status: (typeof JobStatus)[keyof typeof JobStatus];
  createdAt: string;
  updatedAt: string;
}
