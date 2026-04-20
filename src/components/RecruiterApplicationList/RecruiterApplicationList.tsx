import { useGetJobApplications } from "../../hooks/Job";
import type { ApplicationStatusType } from "../../models/Application";
import StatusBadge from "../StatusBadge/StatusBadge";

import "./RecruiterApplicationList.css";

const RecruiterApplicationsList = ({
  jobId,
  onUpdateStatus,
}: {
  jobId: string;
  onUpdateStatus: (id: string, status: ApplicationStatusType) => void;
}) => {
  const { data, isLoading } = useGetJobApplications(jobId, 0, 10);
  const apps = data?.data?.content ?? [];

  if (isLoading)
    return (
      <div className="recruiter-list-p-6 recruiter-list-text-center recruiter-list-text-muted">
        Loading applicants...
      </div>
    );

  if (apps.length === 0)
    return (
      <div className="recruiter-list-p-6 recruiter-list-text-center recruiter-list-text-muted">
        No applicants yet for this listing.
      </div>
    );

  return (
    <div className="recruiter-list-table-responsive">
      <table className="recruiter-list-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Status</th>
            <th>Documents</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((app) => (
            <tr key={app.applicationId}>
              <td>
                <div className="recruiter-list-applicant-name">
                  {app.name || `Applicant #${app.applicantId}`}
                </div>

                <div className="recruiter-list-applicant-date">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </td>

              <td>
                <StatusBadge status={app.status} />
              </td>

              <td>
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="recruiter-list-text-btn-primary"
                  >
                    Resume
                  </a>
                )}
              </td>

              <td style={{ textAlign: "right" }}>
                <select
                  className="recruiter-list-status-select"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruiterApplicationsList;
