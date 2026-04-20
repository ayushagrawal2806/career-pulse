import "./Dashboard.css";
import { Link } from "react-router-dom";
import { Briefcase, ExternalLink, Plus } from "lucide-react";

import { useAppStore } from "../../store/useAppStore";
import type { ApplicationStatusType } from "../../models/Application";
import { useGetMyJobs } from "../../hooks/Job";

import RecruiterApplicationsList from "../../components/RecruiterApplicationList/RecruiterApplicationList";
import { useUpdateApplicationStatus } from "../../hooks/Application";

import type { ErrorModel } from "../../models/Error";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../models/ApiResponse";

const Dashboard = () => {
  const user = useAppStore((state) => state.user);

  //   const [data, setData] = useState<{
  //     jobs?: JobResponseDto[];
  //     applications?: Application[];
  //   }>({});

  const { data: response, isLoading } = useGetMyJobs();

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       setLoading(true);
  //       try {
  //         if (user?.role === "RECRUITER") {
  //           const res = await api.get("/job/my");
  //           setData({ jobs: res.data });
  //         } else if (user?.role === "SEEKER") {
  //           const res = await api.get("/applications/my");
  //           setData({ applications: res.data });
  //         }
  //       } catch (err) {
  //         console.error("Failed to fetch dashboard data", err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchData();
  //   }, [user]);

  const jobs = response?.data ?? [];

  const onSuccess = (data: ApiResponse<void>) => {
    toast.success(data.message);
  };

  const onError = (error: ErrorModel) => {
    console.log("Failed to update application status");
    console.error(error);
  };

  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus(
    onSuccess,
    onError,
  );

  const updateStatus = async (
    applicationId: string,
    status: ApplicationStatusType,
  ) => {
    updateApplicationStatus({
      applicationId,
      payload: { status },
    });
  };

  if (isLoading)
    return (
      <div className="dashboard-loader-container">
        <div className="loader"></div>
        <p className="dashboard-loader-text">Loading your dashboard...</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              {user?.role === "RECRUITER"
                ? "Recruiter Dashboard"
                : "My Applications"}
            </h1>
            <p className="dashboard-subtitle">
              {user?.role === "RECRUITER"
                ? "Manage your job listings and track applicants."
                : "Keep track of the positions you have applied for."}
            </p>
          </div>
          {user?.role === "RECRUITER" && (
            <Link to="/post-job" className="post-job-nav-btn">
              <Plus size={18} />
              Post New Job
            </Link>
          )}
        </div>

        {
          user?.role === "RECRUITER" ? (
            <div className="jobs-manager-list">
              {jobs?.length === 0 ? (
                <div className="empty-state">
                  <Briefcase size={48} className="text-muted mb-4" />
                  <h3 className="empty-title">No job listings yet</h3>
                  <p className="empty-desc">
                    Start hiring by creating your first job post.
                  </p>
                  <Link to="/post-job" className="btn-link mt-6">
                    Create a job listing →
                  </Link>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="recruiter-job-item">
                    <div className="job-item-header">
                      <div>
                        <h3 className="job-item-title">{job.title}</h3>
                        <p className="job-item-meta">
                          {job.location} •{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/job/${job.id}`}
                        className="icon-btn-secondary"
                      >
                        <ExternalLink size={20} />
                      </Link>
                    </div>
                    <RecruiterApplicationsList
                      jobId={job.id}
                      onUpdateStatus={updateStatus}
                    />
                  </div>
                ))
              )}
            </div>
          ) : null
          //   <div className="dashboard-card">
          //     {data.applications?.length === 0 ? (
          //       <div className="empty-state">
          //         <FileCheck size={48} className="text-muted mb-4" />
          //         <h3 className="empty-title">No applications yet</h3>
          //         <p className="empty-desc">
          //           You haven't applied for any jobs yet.
          //         </p>
          //         <Link to="/" className="btn-link mt-6">
          //           Browse jobs →
          //         </Link>
          //       </div>
          //     ) : (
          //       <div className="table-responsive">
          //         <table className="dashboard-table">
          //           <thead>
          //             <tr>
          //               <th>Company & Role</th>
          //               <th>Status</th>
          //               <th>Applied Date</th>
          //               <th style={{ textAlign: "right" }}>Actions</th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             {data.applications?.map((app) => (
          //               <tr key={app.id}>
          //                 <td>
          //                   <div className="applicant-info">
          //                     <div className="applicant-avatar">
          //                       {app.job?.companyName.charAt(0)}
          //                     </div>
          //                     <div>
          //                       <Link
          //                         to={`/job/${app.jobId}`}
          //                         className="applicant-name"
          //                       >
          //                         {app.job?.title}
          //                       </Link>
          //                       <div className="applicant-date">
          //                         {app.job?.companyName}
          //                       </div>
          //                     </div>
          //                   </div>
          //                 </td>
          //                 <td>
          //                   <StatusBadge status={app.status} />
          //                 </td>
          //                 <td className="text-sm text-muted">
          //                   {new Date(app.appliedAt).toLocaleDateString()}
          //                 </td>
          //                 <td style={{ textAlign: "right" }}>
          //                   <button className="text-btn-danger">Withdraw</button>
          //                 </td>
          //               </tr>
          //             ))}
          //           </tbody>
          //         </table>
          //       </div>
          //     )}
          //   </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
