export interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';
  appliedAt: string;
}

export interface ApplicationDetail {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';
  appliedAt: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface Applicant {
  applicantId: string;
  applicationId: string;
  name: string;
  email: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';
  appliedAt: string;
}

export interface ApplicationUpdateRequest {
  status: 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';
}
