export interface User {
  id: string;
  name: string;
  email: string;
  role: "SEEKER" | "RECRUITER";
  phone?: string;
  location?: string;
  resumeUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  bio?: string;
}
