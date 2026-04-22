import { useState } from "react";
import { useGetJobApplications } from "../../hooks/Job";
import type { ApplicationStatusType } from "../../models/Application";
import StatusBadge from "../StatusBadge/StatusBadge";
import Pagination from "../Pagination/Pagination";

import "./RecruiterApplicationList.css";

const RecruiterApplicationsList = ({
  jobId,
  onUpdateStatus,
}: {
  jobId: string;
  onUpdateStatus: (id: string, status: ApplicationStatusType) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading } = useGetJobApplications(jobId, currentPage, 10);
  const apps = data?.data?.content ?? [];
  const totalPages = data?.data?.page?.totalPages ?? 1;
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");

  if (isLoading)
    return (
      <div className="recruiter-app-empty-state">Loading applicants...</div>
    );

  if (apps.length === 0 && currentPage === 0)
    return (
      <div className="recruiter-app-empty-state">
        No applicants yet for this listing.
      </div>
    );

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
                    View Resume
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
                    Cover Letter
                  </button>
                )}
              </div>

              <select
                className="recruiter-app-select"
                value={app.status}
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
      <div style={{ marginBottom: "1rem" }}>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {selectedCoverLetter && (
        <div
          className="recruiter-modal-overlay"
          onClick={() => setSelectedCoverLetter("")}
        >
          <div className="recruiter-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="recruiter-modal-title">Cover Letter</h3>

            <p className="recruiter-modal-text">{selectedCoverLetter}</p>

            <button
              className="recruiter-modal-close"
              onClick={() => setSelectedCoverLetter("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecruiterApplicationsList;
