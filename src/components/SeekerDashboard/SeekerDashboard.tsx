import { FileCheck } from "lucide-react";
import {
  useGetMyAppliedJobs,
  useWithdrawApplication,
} from "../../hooks/Application";
import "./SeekerDashboard.css";
import StatusBadge from "../StatusBadge/StatusBadge";
import { Link } from "react-router-dom";
import type { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";
import type { ErrorModel } from "../../models/Error";
import { useQueryClient } from "@tanstack/react-query";

const SeekerDashboard = () => {
  const { data: response, isLoading } = useGetMyAppliedJobs();
  const applications = response?.data.content;
  const queryClient = useQueryClient();

  const onSuccess = (data: ApiResponse<void>) => {
    queryClient.invalidateQueries({
      queryKey: ["applied-jobs"],
    });
    toast.success(data.message || "Application deleted successfully");
  };

  const onError = (error: ErrorModel) => {
    toast.error(error.message || "Failed to delete application");
  };

  const { mutate: withdrawApplication } = useWithdrawApplication(
    onSuccess,
    onError,
  );

  const handleWithdrawApplication = (applicationId: string) => () => {
    withdrawApplication(applicationId);
  };
  if (isLoading)
    return (
      <div className="seeker-dashboard-loader-container">
        <div className="loader"></div>
        <p className="seeker-dashboard-loader-text">
          Loading your Applications...
        </p>
      </div>
    );
  return (
    <div className="seeker-dashboard-page">
      <div className="seeker-container">
        <div className="seeker-dashboard-header">
          <div>
            <h1 className="seeker-dashboard-title">My Applications</h1>
            <p className="seeker-dashboard-subtitle">
              Keep track of the positions you have applied for.
            </p>
          </div>
        </div>

        <div className="seeker-dashboard-card">
          {applications?.length === 0 ? (
            <div className="seeker-empty-state">
              <FileCheck size={48} className="seeker-text-muted seeker-mb-4" />
              <h3 className="seeker-empty-title">No applications yet</h3>
              <p className="seeker-empty-desc">
                You haven't applied for any jobs yet.
              </p>
              <Link to="/" className="seeker-btn-link seeker-mt-6">
                Browse jobs →
              </Link>
            </div>
          ) : (
            <div className="seeker-table-responsive">
              <table className="seeker-dashboard-table">
                <thead>
                  <tr>
                    <th>Company & Role</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications?.map((app) => (
                    <tr key={app.applicationId}>
                      <td>
                        <div className="seeker-applicant-info">
                          <div className="seeker-applicant-avatar">
                            {app.company.charAt(0)}
                          </div>
                          <div>
                            <Link
                              to={`/job/${app.jobId}`}
                              className="seeker-job-title"
                            >
                              {app.jobTitle}
                            </Link>
                            <div className="seeker-company-name">
                              {app.company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="seeker-text-sm seeker-text-muted">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="seeker-text-btn-danger"
                          onClick={handleWithdrawApplication(app.applicationId)}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
