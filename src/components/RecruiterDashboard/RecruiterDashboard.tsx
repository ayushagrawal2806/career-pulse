import { toast } from "react-toastify";
import {
  useDeleteJob,
  useGetMyJobs,
  useUpdateJobStatus,
} from "../../hooks/Job";
import type { ApiResponse } from "../../models/ApiResponse";
import type { ErrorModel } from "../../models/Error";
import "./RecruiterDashboard.css";
import type { ApplicationStatusType } from "../../models/Application";
import { useUpdateApplicationStatus } from "../../hooks/Application";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import RecruiterApplicationsList from "../RecruiterApplicationList/RecruiterApplicationList";
import { useQueryClient } from "@tanstack/react-query";
import JobStatusBadge from "../JobStatusBadge/JobStatusBadge";
import { useMemo, useState } from "react";
import Modal from "../Modal/Modal";
import type { JobStatusType } from "../../models/Job";

const RecruiterDashboard = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useGetMyJobs();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const jobs = response?.data ?? [];

  const [selectedDeleteJobId, setSelectedDeleteJobId] = useState<string | null>(
    null,
  );

  const [selectedStatusJob, setSelectedStatusJob] = useState<{
    id: string;
    status: JobStatusType;
    action: string;
  } | null>(null);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;

    const openJobs = jobs.filter((job) => job.status === "OPEN").length;

    const draftJobs = jobs.filter((job) => job.status === "DRAFT").length;

    const closedJobs = jobs.filter((job) => job.status === "CLOSED").length;

    return {
      totalJobs,
      openJobs,
      draftJobs,
      closedJobs,
    };
  }, [jobs]);

  const onSuccess = (data: ApiResponse<void>) => {
    queryClient.invalidateQueries({
      queryKey: ["job-applications"],
    });
    toast.success(data.message);
  };

  const onError = (error: ErrorModel) => {
    console.error(error);
    toast.error(error.message || "Something went wrong");
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

    setSelectedDeleteJobId(null);
  };

  const { mutate: deleteJob, isPending: isPendingDeleteJob } = useDeleteJob(
    onDeleteJobSuccess,
    onError,
  );

  const onUpdateStatusSuccess = (response: ApiResponse<void>) => {
    toast.success(response.message);

    queryClient.invalidateQueries({
      queryKey: ["my-jobs"],
    });

    setSelectedStatusJob(null);
  };

  const { mutate: updateJobStatus, isPending: isPendingUpdateStatus } =
    useUpdateJobStatus(onUpdateStatusSuccess, onError);

  const updateStatus = (
    applicationId: string,
    status: ApplicationStatusType,
  ) => {
    updateApplicationStatus({
      applicationId,
      payload: { status },
    });
  };

  const confirmDeleteJob = () => {
    if (selectedDeleteJobId) {
      deleteJob(selectedDeleteJobId);
    }
  };

  const confirmJobStatusUpdate = () => {
    if (selectedStatusJob) {
      updateJobStatus({
        jobId: selectedStatusJob.id,
        payload: {
          status: selectedStatusJob.status,
        },
      });
    }
  };

  const openStatusModal = (
    jobId: string,
    status: JobStatusType,
    action: string,
  ) => {
    setSelectedStatusJob({
      id: jobId,
      status,
      action,
    });
  };

  if (isLoading)
    return (
      <div className="recruiter-dashboard-loader-container">
        <div className="recruiter-loader"></div>
        <p className="recruiter-dashboard-loader-text">
          Loading your dashboard...
        </p>
      </div>
    );

  return (
    <>
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

          <div className="recruiter-stats-grid">
            <div className="recruiter-stat-card">
              <BarChart3 size={22} />
              <div>
                <p>Total Jobs</p>
                <h3>{stats.totalJobs}</h3>
              </div>
            </div>

            <div className="recruiter-stat-card">
              <CheckCircle2 size={22} />
              <div>
                <p>Open Jobs</p>
                <h3>{stats.openJobs}</h3>
              </div>
            </div>

            <div className="recruiter-stat-card">
              <FolderOpen size={22} />
              <div>
                <p>Draft Jobs</p>
                <h3>{stats.draftJobs}</h3>
              </div>
            </div>

            <div className="recruiter-stat-card">
              <Briefcase size={22} />
              <div>
                <p>Closed Jobs</p>
                <h3>{stats.closedJobs}</h3>
              </div>
            </div>
          </div>

          <div>
            {jobs.length === 0 ? (
              <div className="recruiter-empty-state">
                <Briefcase size={48} className="recruiter-empty-icon" />
                <h3 className="recruiter-empty-title">No job listings yet</h3>
                <p className="recruiter-empty-desc">
                  Start hiring by creating your first job post.
                </p>
                <Link to="/post-job" className="recruiter-empty-link">
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
                        {job.companyName} • {job.location} •{" "}
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="recruiter-job-actions">
                      <JobStatusBadge status={job.status} />

                      {job.status === "OPEN" && (
                        <button
                          className="recruiter-action-btn"
                          onClick={() =>
                            openStatusModal(job.id, "CLOSED", "Close")
                          }
                        >
                          Close
                        </button>
                      )}

                      {job.status === "CLOSED" && (
                        <button
                          className="recruiter-action-btn"
                          onClick={() =>
                            openStatusModal(job.id, "OPEN", "Reopen")
                          }
                        >
                          Reopen
                        </button>
                      )}

                      {job.status === "DRAFT" && (
                        <button
                          className="recruiter-action-btn"
                          onClick={() =>
                            openStatusModal(job.id, "OPEN", "Publish")
                          }
                        >
                          Publish
                        </button>
                      )}

                      <Link
                        to={`/edit-job/${job.id}`}
                        className="recruiter-action-btn recruiter-edit-btn"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>

                      <button
                        onClick={() => setSelectedDeleteJobId(job.id)}
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

      <Modal
        isOpen={!!selectedDeleteJobId}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isPendingDeleteJob}
        onConfirm={confirmDeleteJob}
        onClose={() => setSelectedDeleteJobId(null)}
      />

      <Modal
        isOpen={!!selectedStatusJob}
        title={`${selectedStatusJob?.action} Job`}
        message={`Are you sure you want to ${selectedStatusJob?.action?.toLowerCase()} this job posting?`}
        confirmText={selectedStatusJob?.action || "Confirm"}
        cancelText="Cancel"
        variant="primary"
        isLoading={isPendingUpdateStatus}
        onConfirm={confirmJobStatusUpdate}
        onClose={() => setSelectedStatusJob(null)}
      />
    </>
  );
};

export default RecruiterDashboard;
