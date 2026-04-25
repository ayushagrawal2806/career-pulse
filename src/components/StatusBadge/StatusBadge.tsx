import React from "react";
import { Clock3, Search, CheckCircle2, XCircle } from "lucide-react";

import "./StatusBadge.css";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPLIED: "status-pending",
    REVIEWING: "status-reviewing",
    SHORTLISTED: "status-accepted",
    REJECTED: "status-rejected",
  };

  const icons: Record<string, React.ReactNode> = {
    APPLIED: <Clock3 size={12} className="status-icon" />,

    REVIEWING: <Search size={12} className="status-icon" />,

    SHORTLISTED: <CheckCircle2 size={12} className="status-icon" />,

    REJECTED: <XCircle size={12} className="status-icon" />,
  };

  return (
    <span className={`status-badge ${styles[status] || "status-pending"}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default StatusBadge;
