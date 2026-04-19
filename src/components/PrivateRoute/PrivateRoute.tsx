import { Navigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

const PrivateRoute = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "SEEKER" | "RECRUITER";
}) => {
  const user = useAppStore((state) => state.user);

  const tokens = useAppStore((state) => state.tokens);

  if (!tokens) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
