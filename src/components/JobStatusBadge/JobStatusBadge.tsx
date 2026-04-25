import React from "react";
import { CheckCircle2, FileText, Lock } from "lucide-react";

import "./JobStatusBadge.css";

const JobStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    OPEN: "job-status-open",
    CLOSED: "job-status-closed",
    DRAFT: "job-status-draft",
  };

  const icons: Record<string, React.ReactNode> = {
    OPEN: <CheckCircle2 size={12} className="job-status-icon" />,

    CLOSED: <Lock size={12} className="job-status-icon" />,

    DRAFT: <FileText size={12} className="job-status-icon" />,
  };

  return (
    <span
      className={`job-status-badge ${styles[status] || "job-status-draft"}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export default JobStatusBadge;
