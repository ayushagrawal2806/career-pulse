import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import "./StatusBadge.css";
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPLIED: "status-pending",
    REVIEWING: "status-reviewing",
    SHORTLISTED: "status-accepted",
    REJECTED: "status-rejected",
  };

  const icons: Record<string, React.ReactNode> = {
    APPLIED: <Clock size={12} style={{ marginRight: "4px" }} />,
    REVIEWING: <AlertCircle size={12} style={{ marginRight: "4px" }} />,
    SHORTLISTED: <CheckCircle2 size={12} style={{ marginRight: "4px" }} />,
    REJECTED: <XCircle size={12} style={{ marginRight: "4px" }} />,
  };

  return (
    <span className={`status-badge ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default StatusBadge;
