import { toast } from "react-toastify";
import { useDeleteJob, useGetMyJobs } from "../../hooks/Job";
import type { ApiResponse } from "../../models/ApiResponse";
import type { ErrorModel } from "../../models/Error";
import "./RecruiterDashboard.css";
import type { ApplicationStatusType } from "../../models/Application";
import { useUpdateApplicationStatus } from "../../hooks/Application";
import { Link } from "react-router-dom";
import { Briefcase, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import RecruiterApplicationsList from "../RecruiterApplicationList/RecruiterApplicationList";
import { useQueryClient } from "@tanstack/react-query";
import JobStatusBadge from "../JobStatusBadge/JobStatusBadge";

const RecruiterDashboard = () => {
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useGetMyJobs();
  const jobs = response?.data ?? [];

  const onSuccess = (data: ApiResponse<void>) => {
    toast.success(data.message);
  };

  const onError = (error: ErrorModel) => {
    console.log("Failed to update application status");
    console.error(error);
  };

  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus(
    onSuccess,
    onError,
  );

  const onDeleteJobSuccess = (response: ApiResponse<void>) => {
    toast.success(response.message);
    queryClient.invalidateQueries({
      queryKey: ["my-jobs"],
    });
  };

  const onDeleteJobError = (err: ErrorModel) => {
    toast.error(err.message);
  };

  const { mutate: deleteJob, isPending: isPendingDeleteJob } = useDeleteJob(
    onDeleteJobSuccess,
    onDeleteJobError,
  );

  const handleDelete = (jobId: string) => {
    deleteJob(jobId);
  };

  const updateStatus = async (
    applicationId: string,
    status: ApplicationStatusType,
  ) => {
    updateApplicationStatus({
      applicationId,
      payload: { status },
    });
  };

  if (isLoading)
    return (
      <div className="recruiter-dashboard-loader-container">
        <div className="loader"></div>
        <p className="recruiter-dashboard-loader-text">
          Loading your dashboard...
        </p>
      </div>
    );

  return (
    <div className="recruiter-dashboard-page">
      <div className="recruiter-container">
        <div className="recruiter-dashboard-header">
          <div>
            <h1 className="recruiter-dashboard-title">Recruiter Dashboard</h1>
            <p className="recruiter-dashboard-subtitle">
              Manage your job listings and track applicants.
            </p>
          </div>

          <Link to="/post-job" className="recruiter-post-job-nav-btn">
            <Plus size={18} />
            Post New Job
          </Link>
        </div>

        <div>
          {jobs?.length === 0 ? (
            <div className="recruiter-empty-state">
              <Briefcase size={48} className="text-muted mb-4" />
              <h3 className="empty-title">No job listings yet</h3>
              <p className="empty-desc">
                Start hiring by creating your first job post.
              </p>
              <Link to="/post-job" className="btn-link mt-6">
                Create a job listing →
              </Link>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="recruiter-job-item">
                <div className="recruiter-job-item-header">
                  <div>
                    <h3 className="recruiter-job-item-title">{job.title}</h3>
                    <p className="recruiter-job-item-meta">
                      {job.location} •{" "}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="recruiter-job-actions">
                    <JobStatusBadge status={job.status} />
                    <Link
                      to={`/edit-job/${job.id}`}
                      className="recruiter-action-btn recruiter-edit-btn"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={isPendingDeleteJob}
                      className="recruiter-action-btn recruiter-delete-btn"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <Link to={`/job/${job.id}`}>
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                </div>
                <RecruiterApplicationsList
                  jobId={job.id}
                  onUpdateStatus={updateStatus}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
