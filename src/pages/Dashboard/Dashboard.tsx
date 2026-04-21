import { useAppStore } from "../../store/useAppStore";
import RecruiterDashboard from "../../components/RecruiterDashboard/RecruiterDashboard";
import SeekerDashboard from "../../components/SeekerDashboard/SeekerDashboard";

const Dashboard = () => {
  const user = useAppStore((state) => state.user);

  return user?.role === "RECRUITER" ? (
    <RecruiterDashboard />
  ) : (
    <SeekerDashboard />
  );
};

export default Dashboard;
