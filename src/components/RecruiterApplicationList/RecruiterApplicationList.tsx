import { useState } from "react";
import { FileText, FileUser } from "lucide-react";

import { useGetJobApplications } from "../../hooks/Job";
import type { ApplicationStatusType } from "../../models/Application";

import StatusBadge from "../StatusBadge/StatusBadge";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";

import "./RecruiterApplicationList.css";

interface RecruiterApplicationsListProps {
  jobId: string;
  onUpdateStatus: (id: string, status: ApplicationStatusType) => void;
}

const RecruiterApplicationsList = ({
  jobId,
  onUpdateStatus,
}: RecruiterApplicationsListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");

  const { data, isLoading } = useGetJobApplications(jobId, currentPage, 10);

  const apps = data?.data?.content ?? [];

  const totalPages = data?.data?.page?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="recruiter-app-empty-state">Loading applicants...</div>
    );
  }

  if (apps.length === 0 && currentPage === 0) {
    return (
      <div className="recruiter-app-empty-state">
        No applicants yet for this listing.
      </div>
    );
  }

  return (
    <>
      <div className="recruiter-app-list">
        {apps.map((app) => (
          <div key={app.applicationId} className="recruiter-app-card">
            <div className="recruiter-app-top">
              <div>
                <h3 className="recruiter-app-name">
                  {app.name || `Applicant #${app.applicantId}`}
                </h3>

                <p className="recruiter-app-date">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <StatusBadge status={app.status} />
            </div>

            <div className="recruiter-app-actions-row">
              <div className="recruiter-app-docs">
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="recruiter-app-link"
                  >
                    <FileUser size={16} />
                    Resume
                  </a>
                )}

                {app.coverLetter && (
                  <button
                    type="button"
                    className="recruiter-app-link"
                    onClick={() =>
                      setSelectedCoverLetter(app.coverLetter ?? "")
                    }
                  >
                    <FileText size={16} />
                    Cover Letter
                  </button>
                )}
              </div>

              <select
                value={app.status}
                className="recruiter-app-select"
                onChange={(e) =>
                  onUpdateStatus(
                    app.applicationId,
                    e.target.value as ApplicationStatusType,
                  )
                }
              >
                <option value="APPLIED">Applied</option>

                <option value="REVIEWING">Reviewing</option>

                <option value="SHORTLISTED">Shortlisted</option>

                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="recruiter-app-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <Modal
        isOpen={!!selectedCoverLetter}
        title="Cover Letter"
        message={selectedCoverLetter}
        confirmText="Close"
        cancelText=""
        variant="primary"
        onConfirm={() => setSelectedCoverLetter("")}
        onClose={() => setSelectedCoverLetter("")}
      />
    </>
  );
};

export default RecruiterApplicationsList;
