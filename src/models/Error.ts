export interface ErrorModel {
  success: boolean;
  message: string;
  errorCode?: string;
  status: number;
  errors?: Record<string, string>;
  timestamp: string;
}
