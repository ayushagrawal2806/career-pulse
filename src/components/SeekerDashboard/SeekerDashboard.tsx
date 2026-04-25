import { FileCheck } from "lucide-react";
import { useState } from "react";
import {
  useGetMyAppliedJobs,
  useWithdrawApplication,
} from "../../hooks/Application";
import "./SeekerDashboard.css";
import StatusBadge from "../StatusBadge/StatusBadge";
import Pagination from "../Pagination/Pagination";
import { Link } from "react-router-dom";
import type { ApiResponse } from "../../models/ApiResponse";
import { toast } from "react-toastify";
import type { ErrorModel } from "../../models/Error";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../Modal/Modal";

const SeekerDashboard = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { data: response, isLoading } = useGetMyAppliedJobs(currentPage, 10);

  const applications = response?.data.content ?? [];
  const totalPages = response?.data.page?.totalPages || 1;
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const queryClient = useQueryClient();

  const onSuccess = (data: ApiResponse<void>) => {
    queryClient.invalidateQueries({
      queryKey: ["applied-jobs"],
    });

    toast.success(data.message || "Application withdrawn successfully");
    setSelectedApplicationId(null);
  };

  const onError = (error: ErrorModel) => {
    toast.error(error.message || "Failed to withdraw application");
  };

  const { mutate: withdrawApplication, isPending } = useWithdrawApplication(
    onSuccess,
    onError,
  );

  const closeModal = () => {
    if (!isPending) {
      setSelectedApplicationId(null);
    }
  };

  const confirmWithdraw = () => {
    if (selectedApplicationId) {
      withdrawApplication(selectedApplicationId);
    }
  };

  if (isLoading) {
    return (
      <div className="seeker-dashboard-loader-container">
        <div className="seeker-dashboard-loader"></div>

        <p className="seeker-dashboard-loader-text">
          Loading your applications...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="seeker-dashboard-page">
        <div className="seeker-container">
          <div className="seeker-dashboard-header">
            <div>
              <h1 className="seeker-dashboard-title">My Applications</h1>

              <p className="seeker-dashboard-subtitle">
                Track the positions you have applied for.
              </p>
            </div>
          </div>

          <div className="seeker-dashboard-card">
            {applications.length === 0 && currentPage === 0 ? (
              <div className="seeker-empty-state">
                <FileCheck size={48} className="seeker-empty-icon" />

                <h3 className="seeker-empty-title">No applications yet</h3>

                <p className="seeker-empty-desc">
                  You haven’t applied to any jobs yet. Explore opportunities and
                  start applying today.
                </p>

                <Link to="/" className="seeker-btn-link">
                  Browse jobs →
                </Link>
              </div>
            ) : (
              <>
                <div className="seeker-table-responsive">
                  <table className="seeker-dashboard-table">
                    <thead>
                      <tr>
                        <th>Company & Role</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th className="seeker-table-actions-head">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {applications.map((app) => (
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
                            {new Date(app.appliedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>

                          <td className="seeker-table-actions-cell">
                            <button
                              disabled={isPending}
                              className="seeker-text-btn-danger"
                              onClick={() =>
                                setSelectedApplicationId(app.applicationId)
                              }
                            >
                              {isPending ? "Withdrawing..." : "Withdraw"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="seeker-pagination-wrap">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={!!selectedApplicationId}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmText="Withdraw"
        cancelText="Cancel"
        variant="danger"
        isLoading={isPending}
        onConfirm={confirmWithdraw}
        onClose={closeModal}
      />
    </>
  );
};

export default SeekerDashboard;
